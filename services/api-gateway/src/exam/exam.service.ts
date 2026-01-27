import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExamService {
  private readonly logger = new Logger(ExamService.name);
  private readonly examServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.examServiceUrl = this.configService.get<string>('EXAM_SERVICE_URL') || 'http://localhost:3007';
  }

  async getExams(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.examServiceUrl}/exams`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get exams', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get exams',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createExam(createExamDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.examServiceUrl}/exams`, {
          ...createExamDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create exam', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create exam',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async enterMarks(examId: string, marksDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.examServiceUrl}/exams/${examId}/marks`, marksDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to enter marks for exam ${examId}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to enter marks',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getResults(examId: string, query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.examServiceUrl}/exams/${examId}/results`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get results for exam ${examId}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get results',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
