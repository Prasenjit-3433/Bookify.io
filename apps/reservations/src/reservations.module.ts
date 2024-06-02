import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
