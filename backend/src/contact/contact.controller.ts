import { Controller, Post, Body, Logger } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { EmailService } from '../email/email.service';

@Controller('contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private email: EmailService) {}

  @Public()
  @Post()
  async submit(@Body() body: { name: string; email: string; message: string }) {
    this.logger.log(`Contact form submission from ${body.name} <${body.email}>`);
    await this.email.sendEmail({
      to: 'hello@wemine.in',
      subject: `Contact Form: ${body.name}`,
      html: `
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `,
    });
    return { success: true, message: 'Message received. We\'ll get back to you soon.' };
  }
}
