import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'base64_item'
})
export class Base64Entity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'text'
  })
  public value: string;
}
