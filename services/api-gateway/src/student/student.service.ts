import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  private readonly studentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.studentServiceUrl = this.configService.get<string>('STUDENT_SERVICE_URL') || 'http://localhost:3003';
  }

  async getAllStudents(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.studentServiceUrl}/students`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get students', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get students',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStudent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.studentServiceUrl}/students/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createStudent(createStudentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.studentServiceUrl}/students`, {
          ...createStudentDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create student', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStudent(id: string, updateStudentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.studentServiceUrl}/students/${id}`, updateStudentDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStudent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.studentServiceUrl}/students/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
