import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class NotificationsService {
  private readonly client: twilio.Twilio;
  private readonly sesClient: SESClient;

  constructor(private readonly configService: ConfigService) {
    // Twilio
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );

    // AWS SES
    this.sesClient = new SESClient({
      region: this.configService.get('AWS_REGION'),
    });
  }

  async sendSMS(text: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        body: text,
        from: `${this.configService.get('TWILIO_PHONE_NUMBER')}`,
        to: '+918944880305',
      });
      return `SMS sent successfully (SID: ${response.sid})`;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {
    const params = {
      Destination: {
        ToAddresses: [email], // Recipient email address
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: text, // Email body text
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Bookify.io - Payment Successful!🎉', // Email subject
        },
      },
      Source: this.configService.get('AWS_SES_SENDER_EMAIL'), // Sender email address
    };

    try {
      const command = new SendEmailCommand(params);
      const data = await this.sesClient.send(command);
      console.log('Email sent:', data.MessageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Could not send email');
    }
  }

  async notify({ email, text }: NotifyEmailDto) {
    // while developing, it's turned off:
    // await this.sendSMS(text);
    // await this.notifyEmail({ email, text });
  }
}
