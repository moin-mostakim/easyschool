import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('exams')
@Index(['schoolId'])
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  schoolId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date' })
  examDate: Date;

  @Column({ nullable: true })
  classId: string;

  @Column({ nullable: true })
  subjectId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  totalMarks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
