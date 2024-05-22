import { EPost } from './post.entity';
import {
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  Entity,
  JoinColumn,
} from 'typeorm';

@Entity('tag')
export class ETag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  declare id: string;

  @Column({ type: 'varchar', nullable: false })
  declare label: string;

  @ManyToMany(() => EPost, (post) => post.tags, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  @JoinColumn({ name: 'post_ids' })
  declare postIds: EPost[];
}
