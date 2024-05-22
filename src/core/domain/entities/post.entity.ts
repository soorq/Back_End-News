import { ECategory } from './category.entity';
import { EUser } from './user.entity';
import { ETag } from './tag.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class EPost {
  @PrimaryGeneratedColumn({ name: 'posts_id' })
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
  @JoinColumn({ name: 'user_id' })
  declare user: EUser;

  @ManyToMany(() => ETag, (tag) => tag.postIds, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'posts_tags',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  declare tags: ETag[];

  @ManyToMany(() => ECategory, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'posts_category',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
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
