import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({unique: true})
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

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;
}

