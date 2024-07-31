import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly client: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
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
      throw error; // Re-throw for proper error handling
    }
  }

  async notifyEmail({ email, text }: NotifyEmailDto) {}

  async notify({ email, text }: NotifyEmailDto) {
    await this.sendSMS(text);
    await this.notifyEmail({ email, text });
  }
}
