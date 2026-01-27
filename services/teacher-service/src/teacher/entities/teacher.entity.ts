import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('teachers')
@Index(['schoolId'])
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  schoolId: string;

  @Column({ nullable: true })
  employeeId: string;

  @Column('text', { array: true, default: [] })
  assignedClasses: string[];

  @Column('text', { array: true, default: [] })
  assignedSubjects: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
