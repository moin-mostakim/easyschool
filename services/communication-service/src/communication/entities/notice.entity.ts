import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notices')
@Index(['schoolId', 'createdAt'])
export class Notice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  classId: string;

  @Column({ nullable: true })
  sectionId: string;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
