import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { RoleDto } from './role.dto';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @IsEmail()
  @Field()
  email: string;

  @IsStrongPassword()
  @Field()
  password: string;

  @IsNotEmpty()
  @Field()
  ph: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => [RoleDto], { nullable: true })
  roles?: RoleDto[];
}
