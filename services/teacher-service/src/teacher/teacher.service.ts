import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(@InjectRepository(Teacher) private teacherRepository: Repository<Teacher>) {}

  async findAll(query: any) {
    const { schoolId, page = 1, limit = 10 } = query;
    const [data, total] = await this.teacherRepository.findAndCount({
      where: schoolId ? { schoolId } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException();
    return teacher;
  }

  async create(dto: any) {
    const teacher = this.teacherRepository.create(dto);
    return this.teacherRepository.save(teacher);
  }

  async update(id: string, dto: any) {
    const teacher = await this.findOne(id);
    Object.assign(teacher, dto);
    return this.teacherRepository.save(teacher);
  }
}
