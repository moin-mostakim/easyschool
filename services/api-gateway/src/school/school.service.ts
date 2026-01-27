import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger(SchoolService.name);
  private readonly schoolServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.schoolServiceUrl = this.configService.get<string>('SCHOOL_SERVICE_URL') || 'http://localhost:3002';
  }

  async getAllSchools(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.schoolServiceUrl}/schools`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get schools', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get schools',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSchool(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.schoolServiceUrl}/schools/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get school ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get school',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSchool(createSchoolDto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.schoolServiceUrl}/schools`, createSchoolDto),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create school', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create school',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSchool(id: string, updateSchoolDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.schoolServiceUrl}/schools/${id}`, updateSchoolDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update school ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update school',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async approveSchool(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.schoolServiceUrl}/schools/${id}/approve`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to approve school ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to approve school',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async suspendSchool(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.schoolServiceUrl}/schools/${id}/suspend`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to suspend school ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to suspend school',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
