import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY not set — emails will be logged instead of sent');
    }
  }

  async sendOtpEmail(email: string, otp: string) {
    return this.sendEmail({
      to: email,
      subject: 'Your Wemine OTP Code',
      html: this.template(
        'Verify Your Email',
        `Your OTP code is <strong style="font-size: 24px; letter-spacing: 4px;">${otp}</strong>`,
        'This code expires in 10 minutes.',
      ),
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Wemine Password',
      html: this.template(
        'Reset Your Password',
        `<a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>`,
        'This link expires in 15 minutes. If you didn\'t request this, ignore this email.',
      ),
    });
  }

  async sendOrderConfirmation(email: string, orderNumber: string, items: any[], total: number) {
    return this.sendEmail({
      to: email,
      subject: `Order Confirmed - ${orderNumber}`,
      html: this.template(
        'Order Confirmed',
        `<p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
         <p>Total: ₹${total.toLocaleString('en-IN')}</p>
         <p>We'll notify you when it ships.</p>`,
      ),
    });
  }

  async sendShippingUpdate(email: string, orderNumber: string, trackingNumber: string) {
    return this.sendEmail({
      to: email,
      subject: `Your Order Has Shipped - ${orderNumber}`,
      html: this.template(
        'Your Order Has Shipped',
        `<p>Order <strong>${orderNumber}</strong> is on its way!</p>
         <p>Tracking: <strong>${trackingNumber}</strong></p>`,
      ),
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Wemine',
      html: this.template(
        'Welcome to Wemine',
        `<p>Hi ${name}, welcome to the Wemine community! You're now part of a world of premium mountain-inspired wear.</p>
         <p>Explore our latest collection and gear up for your next adventure.</p>`,
      ),
    });
  }

  async sendEmail({ to, subject, html, replyTo }: { to: string; subject: string; html: string; replyTo?: string }) {
    if (!this.resend) {
      this.logger.error(`[Email skipped] RESEND_API_KEY not configured — cannot send to ${to}`);
      throw new Error('Email service not configured (RESEND_API_KEY missing)');
    }
    try {
      const from = this.config.get('EMAIL_FROM') || 'Wemine <noreply@wemine.in>';
      await this.resend.emails.send({ from, to, subject, html, replyTo });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }

  private template(title: string, content: string, footer?: string) {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;font-family:'Outfit','Inter',-apple-system,sans-serif;background:#f4f9f9;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:40px 20px;">
              <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.08);">
                <tr><td style="padding:40px;text-align:center;">
                  <h1 style="font-size:28px;font-weight:600;color:#1a1a1a;margin:0 0 8px;font-family:'Outfit',sans-serif;">WEMINE</h1>
                  <p style="color:#888;font-size:13px;margin:0 0 32px;">hello@wemine.in</p>
                  <h2 style="font-size:20px;color:#1a1a1a;margin:0 0 24px;">${title}</h2>
                  ${content}
                  ${footer ? `<p style="color:#888;font-size:13px;margin-top:24px;">${footer}</p>` : ''}
                </td></tr>
                <tr><td style="padding:24px 40px;background:#f4f9f9;border-radius:0 0 16px 16px;">
                  <p style="color:#aaa;font-size:12px;text-align:center;margin:0;">© 2024 Wemine. All rights reserved.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `;
  }
}
