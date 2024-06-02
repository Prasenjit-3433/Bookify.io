import { Controller, Get } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  getHello(): string {
    return this.reservationsService.getHello();
  }
}
