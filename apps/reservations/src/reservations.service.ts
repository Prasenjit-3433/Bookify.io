import { Injectable } from '@nestjs/common';

@Injectable()
export class ReservationsService {
  getHello(): string {
    return 'Hello World!';
  }
}
