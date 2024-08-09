import { AbstractEntity } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@Entity()
@InputType()
export class Role extends AbstractEntity<Role> {
  @Column()
  @Field()
  name: string;
}
