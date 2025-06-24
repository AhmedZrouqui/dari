import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@dari/types';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Initialize the transporter using credentials from .env
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(
    user: User & { profile: { name: string } | null },
    token: string,
  ) {
    // The URL your frontend will use for the reset page
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`; // Adjust domain for production

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: user.email,
      subject: 'Dari - Password Reset Request',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${user.profile?.name || 'there'},</p>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #0D47A1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error(
        `Failed to send password reset email to ${user.email}`,
        error,
      );
      // In a real app, you might add more robust error handling here
    }
  }
}
