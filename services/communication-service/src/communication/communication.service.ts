import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(Notice) private noticeRepository: Repository<Notice>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getNotices(query: any) {
    const { schoolId, classId, page = 1, limit = 10 } = query;
    const where: any = { schoolId };
    if (classId) where.classId = classId;

    const [data, total] = await this.noticeRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async createNotice(dto: any) {
    const notice = this.noticeRepository.create(dto);
    return this.noticeRepository.save(notice);
  }

  async getMessages(query: any) {
    const { userId, schoolId, page = 1, limit = 10 } = query;
    const [data, total] = await this.messageRepository.findAndCount({
      where: [
        { fromUserId: userId, schoolId },
        { toUserId: userId, schoolId },
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async sendMessage(dto: any) {
    const message = this.messageRepository.create(dto);
    return this.messageRepository.save(message);
  }
}
