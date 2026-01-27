import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);
  private readonly attendanceServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.attendanceServiceUrl = this.configService.get<string>('ATTENDANCE_SERVICE_URL') || 'http://localhost:3006';
  }

  async markAttendance(markAttendanceDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.attendanceServiceUrl}/attendance`, {
          ...markAttendanceDto,
          schoolId: user.schoolId,
          markedBy: user.userId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to mark attendance', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to mark attendance',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAttendance(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.attendanceServiceUrl}/attendance`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get attendance', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get attendance',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAttendanceById(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.attendanceServiceUrl}/attendance/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get attendance ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get attendance',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAttendance(id: string, updateAttendanceDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.attendanceServiceUrl}/attendance/${id}`, {
          ...updateAttendanceDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update attendance ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update attendance',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAttendance(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.attendanceServiceUrl}/attendance/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete attendance ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete attendance',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
