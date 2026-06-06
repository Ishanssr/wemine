import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    signup(dto: SignupDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto, res: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    sendOtp(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyEmail(body: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        email: string;
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, body: any): Promise<any>;
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
    verifyTwoFactor(userId: string, body: {
        token: string;
    }): Promise<{
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
    githubAuth(): Promise<void>;
    githubCallback(req: any, res: any): Promise<void>;
}
