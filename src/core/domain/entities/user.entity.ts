import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EPost } from './post.entity';
import { Role } from '@/shared/roles';

@Entity('user')
export class EUser {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  declare id: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare first_name: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare last_name: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare img: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare age: string;

  @Column({ type: 'varchar', array: false, nullable: true, length: 255 })
  declare password: string;

  @Column({
    type: 'enum',
    array: false,
    nullable: false,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'varchar',
    array: false,
    nullable: false,
    length: 255,
    unique: true,
  })
  declare email: string;

  @OneToMany(() => EPost, (post) => post.user, { nullable: true })
  declare posts: EPost[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
