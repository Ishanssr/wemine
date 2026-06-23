import { Controller, Post, Body, Logger, InternalServerErrorException } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { EmailService } from '../email/email.service';

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private email: EmailService) {}

  @Public()
  @Post()
  async submit(@Body() body: Record<string, any>) {
    const { name, email, message } = body || {};
    if (!name || !email || !message) {
      this.logger.warn(`Invalid contact submission: missing fields`);
      return { success: false, message: 'All fields are required.' };
    }

    this.logger.log(`Contact form submission from ${name} <${email}>`);
    try {
      await this.email.sendEmail({
        to: 'hello@wemine.in',
        subject: `Contact Form: ${name}`,
        replyTo: email,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      this.logger.log(`Contact email sent successfully`);
      return { success: true, message: 'Message received. We\'ll get back to you soon.' };
    } catch (err) {
      this.logger.error(`Failed to send contact email: ${err.message}`);
      throw new InternalServerErrorException('Failed to send message. Please email us directly at hello@wemine.in');
    }
  }
}
