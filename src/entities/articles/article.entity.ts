import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'text' })
  author: string;

  @Column({ type: 'integer', nullable: true })
  points: number;

  @Column({ type: 'text', nullable: true })
  story_text: string;

  @Column({ type: 'text', nullable: true })
  comment_text: string;

  @Column({ type: 'integer', nullable: true })
  num_comments: number;

  @Column({ type: 'integer', nullable: true })
  story_id: number;

  @Column({ type: 'text', nullable: true })
  story_title: string;

  @Column({ type: 'text', nullable: true })
  story_url: string;

  @Column({ type: 'integer', nullable: true })
  parent_id: number;

  @Column({ type: 'integer', nullable: true })
  created_at_i: number;

  @Column({ type: 'text', array: true, nullable: true })
  _tags: string[];

  @Column({ type: 'text', nullable: true })
  objectID: string;

  @Column({ type: 'simple-json', nullable: true })
  _highlightResult: { [key: string]: any };
}
