import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'base64_items'
})
export class Base64Entity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'clob'
  })
  public value: string;
}
