import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'user'
})
export class UserEntity {
  static fromID(id: number) {
    const userEntity = new UserEntity();
    userEntity.id = id;
    return userEntity;
  }

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
