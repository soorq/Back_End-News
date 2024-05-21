import { EPost } from './post.entity';
import {
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  Entity,
  JoinColumn,
} from 'typeorm';

@Entity('tags')
export class ETag {
  @PrimaryGeneratedColumn({ name: 'tags_ids' })
  declare id: string;

  @Column({ type: 'varchar', nullable: false })
  declare label: string;

  @ManyToMany(() => EPost, (post) => post.tags, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({ name: 'post_ids' })
  declare postIds: EPost[];
}
