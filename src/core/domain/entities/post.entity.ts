import { ECategory } from './category.entity';
import { EUser } from './user.entity';
import { ETag } from './tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class EPost {
  @PrimaryGeneratedColumn({ name: 'posts_ids' })
  id: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare title: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare desc: string;

  @Column({ type: 'varchar', array: false, nullable: false, unique: true })
  declare link: string;

  @Column({ type: 'varchar', array: false, nullable: false })
  declare city: string;

  @ManyToOne(() => EUser, (user) => user.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  declare user: EUser;

  @ManyToMany(() => ETag, (tag) => tag.postIds, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn([{ name: 'tags_id', referencedColumnName: 'id' }])
  declare tags: ETag[];

  @ManyToMany(() => ECategory, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn([{ name: 'categories_id', referencedColumnName: 'id' }])
  declare category: ECategory[];

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
