import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class NotificationsService {
  private readonly client: twilio.Twilio;

  private readonly oAuth2Client;

  private transporter;

  constructor(private readonly configService: ConfigService) {
    // Twilio
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );

    // Google OAuth for SMTP
    this.oAuth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );

    this.oAuth2Client.setCredentials({
      refresh_token: this.configService.get('GOOGLE_REFRESH_TOKEN'),
    });
  }

  async initialize() {
    try {
      const accessToken = await this.oAuth2Client.getAccessToken();

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get('SMTP_USER'),
          clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
          clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
          refreshToken: this.configService.get('GOOGLE_REFRESH_TOKEN'),
          accessToken: accessToken,
        },
      });
    } catch (error) {
      // Handle error
      console.error('Error initializing notifications service:', error);
    }
  }

  async sendSMS(text: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        body: text,
        from: '+17696001558',
        to: '+918944880305',
      });
      return `SMS sent successfully (SID: ${response.sid})`;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    // Generate accessToken & initialize transporter
    await this.initialize();

    const mailOptions = {
      from: `Successful🎉 <${this.configService.get('SMTP_USER')}>`,
      to: email,
      subject: 'Bookify.IO Notification',
      text,
    };

    await this.transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  async notify({ email, text }: NotifyEmailDto) {
    // await this.sendSMS(text);
    await this.notifyEmail({ email, text });
  }
}
