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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.config.get('SMTP_HOST'),
            port: parseInt(this.config.get('SMTP_PORT') || '587'),
            auth: {
                user: this.config.get('SMTP_USER'),
                pass: this.config.get('SMTP_PASS'),
            },
        });
    }
    async sendOtpEmail(email, otp) {
        return this.sendEmail({
            to: email,
            subject: 'Your Wemine OTP Code',
            html: this.template('Verify Your Email', `Your OTP code is <strong style="font-size: 24px; letter-spacing: 4px;">${otp}</strong>`, 'This code expires in 10 minutes.'),
        });
    }
    async sendPasswordResetEmail(email, resetUrl) {
        return this.sendEmail({
            to: email,
            subject: 'Reset Your Wemine Password',
            html: this.template('Reset Your Password', `<a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>`, 'This link expires in 15 minutes. If you didn\'t request this, ignore this email.'),
        });
    }
    async sendOrderConfirmation(email, orderNumber, items, total) {
        return this.sendEmail({
            to: email,
            subject: `Order Confirmed - ${orderNumber}`,
            html: this.template('Order Confirmed', `<p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
         <p>Total: ₹${total.toLocaleString('en-IN')}</p>
         <p>We'll notify you when it ships.</p>`),
        });
    }
    async sendShippingUpdate(email, orderNumber, trackingNumber) {
        return this.sendEmail({
            to: email,
            subject: `Your Order Has Shipped - ${orderNumber}`,
            html: this.template('Your Order Has Shipped', `<p>Order <strong>${orderNumber}</strong> is on its way!</p>
         <p>Tracking: <strong>${trackingNumber}</strong></p>`),
        });
    }
    async sendWelcomeEmail(email, name) {
        return this.sendEmail({
            to: email,
            subject: 'Welcome to Wemine',
            html: this.template('Welcome to Wemine', `<p>Hi ${name}, welcome to the Wemine community! You're now part of a world of premium mountain-inspired wear.</p>
         <p>Explore our latest collection and gear up for your next adventure.</p>`),
        });
    }
    async sendEmail({ to, subject, html }) {
        try {
            await this.transporter.sendMail({
                from: this.config.get('EMAIL_FROM') || 'noreply@wemine.com',
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent to ${to}: ${subject}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}: ${error.message}`);
        }
    }
    template(title, content, footer) {
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
                  <p style="color:#888;font-size:13px;margin:0 0 32px;">Premium Mountain Wear</p>
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map