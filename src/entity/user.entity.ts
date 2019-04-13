import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'user'
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column({ unique: true })
  public username: string;

  @Column()
  public hash: string;

  @Column({
    default: 'NORMAL'
  })
  public type: string;

  @Column({
    default: 'ACTIVE'
  })
  public status: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
