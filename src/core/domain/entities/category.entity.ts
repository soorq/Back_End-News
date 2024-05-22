import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EPost } from './post.entity';

@Entity('category')
export class ECategory {
  @PrimaryGeneratedColumn({ name: 'categories_ids' })
  declare id: string;

  @Column({ type: 'varchar', nullable: false })
  declare label: string;

  @Column({ type: 'varchar', nullable: false })
  declare value: string;

  @ManyToMany(() => EPost, (post) => post.category, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    nullable: true,
  })
  declare post: EPost[];
}
