import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CardMessage } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CardDto implements CardMessage {
  @IsString()
  @IsNotEmpty()
  @Field()
  cvc: string;

  @IsNumber()
  @Field()
  expMonth: number;

  @IsNumber()
  @Field()
  expYear: number;

  @IsCreditCard()
  @Field()
  number: string;
}
