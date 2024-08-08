import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Reservation } from './models/reservation.entity';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, User } from '@app/common';
import { string } from 'joi';

@Resolver(() => Reservation)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => Reservation)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: User,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Query(() => [Reservation], { name: 'reservations' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Query(() => Reservation, { name: 'reservation' })
  findOne(@Args('id', { type: () => string }) id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Mutation(() => Reservation)
  removeReservation(@Args('id', { type: () => string }) id: string) {
    return this.reservationsService.remove(+id);
  }
}
