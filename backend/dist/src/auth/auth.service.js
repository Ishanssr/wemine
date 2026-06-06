"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const nestjs_prisma_1 = require("nestjs-prisma");
const argon2 = require("argon2");
const uuid_1 = require("uuid");
const otplib_1 = require("otplib");
const qrcode_1 = require("qrcode");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwt, config, usersService, emailService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.usersService = usersService;
        this.emailService = emailService;
        this.logger = new common_1.Logger(AuthService_1.name);
        this.otpStore = new Map();
    }
    async signup(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already registered');
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
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await argon2.verify(user.passwordHash, dto.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || !user.refreshTokenHash) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
            if (!valid)
                throw new common_1.UnauthorizedException('Token revoked');
            return this.generateTokens(user.id, user.email, user.role);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRY') || '15m',
        });
        const refreshToken = this.jwt.sign(payload, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRY') || '7d',
        });
        const refreshTokenHash = await argon2.hash(refreshToken);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash },
        });
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: null },
        });
    }
    async sendEmailVerificationOtp(email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(email, { otp, expires: new Date(Date.now() + 10 * 60 * 1000) });
        await this.emailService.sendOtpEmail(email, otp);
        return { message: 'OTP sent' };
    }
    async verifyEmail(email, otp) {
        const stored = this.otpStore.get(email);
        if (!stored || stored.otp !== otp || stored.expires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        this.otpStore.delete(email);
        await this.prisma.user.update({
            where: { email },
            data: { isEmailVerified: true },
        });
        return { message: 'Email verified' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { message: 'If the email exists, a reset link has been sent' };
        const token = (0, uuid_1.v4)();
        this.otpStore.set(`reset:${email}`, {
            otp: token,
            expires: new Date(Date.now() + 15 * 60 * 1000),
        });
        const resetUrl = `${this.config.get('FRONTEND_URL')}/auth/reset-password?token=${token}&email=${email}`;
        await this.emailService.sendPasswordResetEmail(email, resetUrl);
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async resetPassword(email, token, newPassword) {
        const stored = this.otpStore.get(`reset:${email}`);
        if (!stored || stored.otp !== token || stored.expires < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        this.otpStore.delete(`reset:${email}`);
        const passwordHash = await argon2.hash(newPassword);
        await this.prisma.user.update({
            where: { email },
            data: { passwordHash },
        });
        return { message: 'Password reset successful' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: true,
                wallet: true,
            },
        });
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
        });
        return this.sanitizeUser(user);
    }
    async getSessions(userId) {
        return this.prisma.session.findMany({
            where: { userId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async revokeSession(userId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: { id: sessionId, userId },
        });
        if (!session)
            throw new common_1.BadRequestException('Session not found');
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { isActive: false },
        });
    }
    async setupTwoFactor(userId) {
        const secret = otplib_1.authenticator.generateSecret();
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret },
        });
        const otpauth = otplib_1.authenticator.keyuri(userId, 'Wemine', secret);
        const qrCode = await (0, qrcode_1.toDataURL)(otpauth);
        return { secret, qrCode };
    }
    async verifyTwoFactor(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            throw new common_1.BadRequestException('2FA not set up');
        const valid = otplib_1.authenticator.verify({ token, secret: user.twoFactorSecret });
        if (!valid)
            throw new common_1.BadRequestException('Invalid 2FA token');
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        return { message: '2FA enabled' };
    }
    async handleOAuthLogin(provider, profile) {
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
            const tokens = await this.generateTokens(account.user.id, account.user.email, account.user.role);
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
    sanitizeUser(user) {
        const { passwordHash, refreshTokenHash, twoFactorSecret, ...safe } = user;
        return safe;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        users_service_1.UsersService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map