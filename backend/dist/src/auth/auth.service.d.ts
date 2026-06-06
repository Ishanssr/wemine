import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private usersService;
    private emailService;
    private readonly logger;
    private otpStore;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, usersService: UsersService, emailService: EmailService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateTokens(userId: string, email: string, role: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    sendEmailVerificationOtp(email: string): Promise<{
        message: string;
    }>;
    verifyEmail(email: string, otp: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, token: string, newPassword: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: any): Promise<any>;
    getSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        userId: string;
        sessionToken: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        expiresAt: Date;
    }[]>;
    revokeSession(userId: string, sessionId: string): Promise<void>;
    setupTwoFactor(userId: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    verifyTwoFactor(userId: string, token: string): Promise<{
        message: string;
    }>;
    handleOAuthLogin(provider: string, profile: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    private sanitizeUser;
}
