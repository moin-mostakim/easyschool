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

  async getExam(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.examServiceUrl}/exams/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get exam ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get exam',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createExam(createExamDto: any, user: any) {
    try {
      const schoolId = createExamDto.schoolId || user.schoolId;
      
      if (!schoolId) {
        throw new HttpException('School ID is required', HttpStatus.BAD_REQUEST);
      }

      // Ensure required fields are present
      if (!createExamDto.name) {
        throw new HttpException('Exam name is required', HttpStatus.BAD_REQUEST);
      }
      if (!createExamDto.examDate) {
        throw new HttpException('Exam date is required', HttpStatus.BAD_REQUEST);
      }
      if (createExamDto.totalMarks === undefined || createExamDto.totalMarks === null) {
        createExamDto.totalMarks = 100; // Default to 100 if not provided
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.examServiceUrl}/exams`, {
          ...createExamDto,
          schoolId: schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      // Return ALL submitted data from frontend
      return {
        ...response.data,
        name: createExamDto.name,
        subject: createExamDto.subject || response.data.subject,
        date: createExamDto.date || createExamDto.examDate || response.data.date || response.data.examDate,
        examDate: createExamDto.examDate || createExamDto.date || response.data.examDate || response.data.date,
        maxMarks: createExamDto.maxMarks || createExamDto.totalMarks || response.data.maxMarks || response.data.totalMarks,
        totalMarks: createExamDto.totalMarks || createExamDto.maxMarks || response.data.totalMarks || response.data.maxMarks,
        description: createExamDto.description || response.data.description,
        schoolId: schoolId,
      };
    } catch (error: any) {
      this.logger.error('Failed to create exam', error.stack);
      this.logger.error('Exam data:', JSON.stringify(createExamDto, null, 2));
      throw new HttpException(
        error.response?.data || error.message || 'Failed to create exam',
        error.response?.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
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

  async updateExam(id: string, updateExamDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.examServiceUrl}/exams/${id}`, {
          ...updateExamDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      // Return ALL submitted data from frontend
      return {
        ...response.data,
        name: updateExamDto.name || response.data.name,
        subject: updateExamDto.subject || response.data.subject,
        date: updateExamDto.date || updateExamDto.examDate || response.data.date || response.data.examDate,
        examDate: updateExamDto.examDate || updateExamDto.date || response.data.examDate || response.data.date,
        maxMarks: updateExamDto.maxMarks || updateExamDto.totalMarks || response.data.maxMarks || response.data.totalMarks,
        totalMarks: updateExamDto.totalMarks || updateExamDto.maxMarks || response.data.totalMarks || response.data.maxMarks,
        description: updateExamDto.description || response.data.description,
      };
    } catch (error) {
      this.logger.error(`Failed to update exam ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update exam',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteExam(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.examServiceUrl}/exams/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete exam ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete exam',
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
