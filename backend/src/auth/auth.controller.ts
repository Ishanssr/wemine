import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.auth.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const result = await this.auth.login(dto);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: any) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    return this.auth.refreshToken(token);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@CurrentUser('id') userId: string) {
    return this.auth.logout(userId);
  }

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() body: { email: string }) {
    return this.auth.sendEmailVerificationOtp(body.email);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() body: { email: string; otp: string }) {
    return this.auth.verifyEmail(body.email, body.otp);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; token: string; password: string }) {
    return this.auth.resetPassword(body.email, body.token, body.password);
  }

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.auth.getProfile(userId);
  }

  @Patch('profile')
  async updateProfile(@CurrentUser('id') userId: string, @Body() body: any) {
    return this.auth.updateProfile(userId, body);
  }

  @Get('sessions')
  async getSessions(@CurrentUser('id') userId: string) {
    return this.auth.getSessions(userId);
  }

  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.auth.revokeSession(userId, sessionId);
  }

  @Post('2fa/setup')
  async setupTwoFactor(@CurrentUser('id') userId: string) {
    return this.auth.setupTwoFactor(userId);
  }

  @Post('2fa/verify')
  async verifyTwoFactor(
    @CurrentUser('id') userId: string,
    @Body() body: { token: string },
  ) {
    return this.auth.verifyTwoFactor(userId, body.token);
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('google/debug')
  async googleDebug() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    const frontendUrl = process.env.FRONTEND_URL;
    return {
      hasClientId: !!clientId,
      clientIdLength: clientId?.length || 0,
      hasClientSecret: !!clientSecret,
      clientSecretLength: clientSecret?.length || 0,
      callbackUrl,
      frontendUrl,
    };
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const result = await this.auth.handleOAuthLogin('google', req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: any, @Res() res: any) {
    const result = await this.auth.handleOAuthLogin('github', req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.accessToken}`);
  }
}
