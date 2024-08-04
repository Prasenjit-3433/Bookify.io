import { CreateChargeDto } from '@app/common';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PaymentsCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  ph: string;
}
