import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { ExamResult } from './entities/exam-result.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam) private examRepository: Repository<Exam>,
    @InjectRepository(ExamResult) private examResultRepository: Repository<ExamResult>,
  ) {}

  async findAll(query: any) {
    const { schoolId, page = 1, limit = 10 } = query;
    const [data, total] = await this.examRepository.findAndCount({
      where: schoolId ? { schoolId } : {},
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async create(dto: any) {
    const exam = this.examRepository.create(dto);
    return this.examRepository.save(exam);
  }

  async enterMarks(examId: string, dto: any) {
    const result = this.examResultRepository.create({
      examId,
      ...dto,
      percentage: (dto.marksObtained / dto.totalMarks) * 100,
    });
    return this.examResultRepository.save(result);
  }

  async getResults(examId: string, query: any) {
    const { studentId } = query;
    const where: any = { examId };
    if (studentId) where.studentId = studentId;

    return this.examResultRepository.find({ where, relations: ['exam'] });
  }
}
