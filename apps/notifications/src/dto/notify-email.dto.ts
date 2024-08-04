import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  ph: string;

  @IsString()
  text: string;
}
