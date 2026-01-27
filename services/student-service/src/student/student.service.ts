import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(query: any) {
    const { schoolId, page = 1, limit = 10 } = query;
    const [data, total] = await this.studentRepository.findAndCount({
      where: schoolId ? { schoolId } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException();
    return student;
  }

  async create(dto: any) {
    const student = this.studentRepository.create(dto);
    return this.studentRepository.save(student);
  }

  async update(id: string, dto: any) {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  async delete(id: string) {
    await this.studentRepository.delete(id);
    return { success: true };
  }
}
