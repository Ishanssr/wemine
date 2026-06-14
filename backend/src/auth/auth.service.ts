import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private otpStore = new Map<string, { otp: string; expires: Date }>();

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    await this.sendEmailVerificationOtp(user.email);

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (!valid) throw new UnauthorizedException('Token revoked');

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET') || this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRY') || '1h',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRY') || '365d',
    });

    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async sendEmailVerificationOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(email, { otp, expires: new Date(Date.now() + 10 * 60 * 1000) });
    await this.emailService.sendOtpEmail(email, otp);
    return { message: 'OTP sent' };
  }

  async verifyEmail(email: string, otp: string) {
    const stored = this.otpStore.get(email);
    if (!stored || stored.otp !== otp || stored.expires < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    this.otpStore.delete(email);
    await this.prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });
    return { message: 'Email verified' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const token = uuidv4();
    this.otpStore.set(`reset:${email}`, {
      otp: token,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetUrl = `${this.config.get('FRONTEND_URL')}/auth/reset-password?token=${token}&email=${email}`;
    await this.emailService.sendPasswordResetEmail(email, resetUrl);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const stored = this.otpStore.get(`reset:${email}`);
    if (!stored || stored.otp !== token || stored.expires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    this.otpStore.delete(`reset:${email}`);

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
    return { message: 'Password reset successful' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: true,
        wallet: true,
      },
    });
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return this.sanitizeUser(user);
  }

  async getSessions(userId: string) {
    return this.prisma.session.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new BadRequestException('Session not found');
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async setupTwoFactor(userId: string) {
    const secret = authenticator.generateSecret();
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const otpauth = authenticator.keyuri(
      userId,
      'Wemine',
      secret,
    );
    const qrCode = await toDataURL(otpauth);
    return { secret, qrCode };
  }

  async verifyTwoFactor(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new BadRequestException('2FA not set up');

    const valid = authenticator.verify({ token, secret: user.twoFactorSecret });
    if (!valid) throw new BadRequestException('Invalid 2FA token');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { message: '2FA enabled' };
  }

  async handleOAuthLogin(provider: string, profile: any) {
    let account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId: profile.id,
        },
      },
      include: { user: true },
    });

    if (account) {
      const tokens = await this.generateTokens(
        account.user.id,
        account.user.email,
        account.user.role,
      );
      return { user: this.sanitizeUser(account.user), ...tokens };
    }

    let user = await this.prisma.user.findUnique({
      where: { email: profile.emails?.[0]?.value },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.emails?.[0]?.value || `${profile.id}@${provider}.com`,
          firstName: profile.name?.givenName || profile.displayName?.split(' ')[0],
          lastName: profile.name?.familyName,
          avatarUrl: profile.photos?.[0]?.value,
          isEmailVerified: true,
        },
      });
    }

    await this.prisma.account.create({
      data: {
        provider,
        providerAccountId: profile.id,
        userId: user.id,
        accessToken: profile.accessToken,
        refreshToken: profile.refreshToken,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, refreshTokenHash, twoFactorSecret, ...safe } = user;
    return safe;
  }
}
