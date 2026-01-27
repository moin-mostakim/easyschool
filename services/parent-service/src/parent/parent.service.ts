import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from './entities/parent.entity';

@Injectable()
export class ParentService {
  constructor(@InjectRepository(Parent) private parentRepository: Repository<Parent>) {}

  async findAll(query: any) {
    const { schoolId, page = 1, limit = 10 } = query;
    const [data, total] = await this.parentRepository.findAndCount({
      where: schoolId ? { schoolId } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const parent = await this.parentRepository.findOne({ where: { id } });
    if (!parent) throw new NotFoundException();
    return parent;
  }

  async create(dto: any) {
    const parent = this.parentRepository.create(dto);
    return this.parentRepository.save(parent);
  }

  async update(id: string, dto: any) {
    const parent = await this.findOne(id);
    Object.assign(parent, dto);
    return this.parentRepository.save(parent);
  }
}
