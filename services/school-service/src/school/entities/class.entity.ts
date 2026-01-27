import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { School } from './school.entity';
import { Section } from './section.entity';

@Entity('classes')
@Index(['schoolId', 'name'])
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  schoolId: string;

  @ManyToOne(() => School, (school) => school.classes)
  @JoinColumn({ name: 'schoolId' })
  school: School;

  @OneToMany(() => Section, (section) => section.class)
  sections: Section[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
