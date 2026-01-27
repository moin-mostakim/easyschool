import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name);
  private readonly teacherServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.teacherServiceUrl = this.configService.get<string>('TEACHER_SERVICE_URL') || 'http://localhost:3004';
  }

  async getAllTeachers(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.teacherServiceUrl}/teachers`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get teachers', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get teachers',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTeacher(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.teacherServiceUrl}/teachers/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get teacher ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get teacher',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTeacher(createTeacherDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.teacherServiceUrl}/teachers`, {
          ...createTeacherDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create teacher', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create teacher',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTeacher(id: string, updateTeacherDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.teacherServiceUrl}/teachers/${id}`, updateTeacherDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update teacher ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update teacher',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTeacher(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.teacherServiceUrl}/teachers/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete teacher ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete teacher',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
