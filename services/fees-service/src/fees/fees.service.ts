import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fee } from './entities/fee.entity';
import { FeePayment } from './entities/fee-payment.entity';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(Fee) private feeRepository: Repository<Fee>,
    @InjectRepository(FeePayment) private feePaymentRepository: Repository<FeePayment>,
  ) {}

  async findAll(query: any) {
    const { schoolId, studentId, page = 1, limit = 10 } = query;
    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (studentId) where.studentId = studentId;

    const [data, total] = await this.feeRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async create(dto: any) {
    const fee = this.feeRepository.create(dto);
    return this.feeRepository.save(fee);
  }

  async recordPayment(feeId: string, dto: any) {
    const payment = this.feePaymentRepository.create({ feeId, ...dto });
    await this.feePaymentRepository.save(payment);

    const fee = await this.feeRepository.findOne({ where: { id: feeId } });
    if (fee) {
      fee.isPaid = true;
      await this.feeRepository.save(fee);
    }

    return payment;
  }
}
