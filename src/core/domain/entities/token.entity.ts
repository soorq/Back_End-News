import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EUser } from './user.entity';

@Entity('token')
export class EToken {
  @PrimaryGeneratedColumn({ name: 'token_id' })
  declare id: string;

  @OneToOne(() => EUser, (user) => user.token, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  declare user: EUser;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare refresh: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare access: string;
}
