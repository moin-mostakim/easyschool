import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>) {}

  async mark(dto: any) {
    const attendance = this.attendanceRepository.create(dto);
    return this.attendanceRepository.save(attendance);
  }

  async findAll(query: any) {
    const { schoolId, studentId, date, page = 1, limit = 10 } = query;
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (studentId) where.studentId = studentId;
    if (date) where.date = date;

    const [data, total] = await this.attendanceRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException();
    return attendance;
  }
}
