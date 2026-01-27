import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ParentService {
  private readonly logger = new Logger(ParentService.name);
  private readonly parentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.parentServiceUrl = this.configService.get<string>('PARENT_SERVICE_URL') || 'http://localhost:3005';
  }

  async getAllParents(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.parentServiceUrl}/parents`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get parents', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get parents',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getParent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.parentServiceUrl}/parents/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get parent ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get parent',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createParent(createParentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.parentServiceUrl}/parents`, {
          ...createParentDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create parent', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create parent',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateParent(id: string, updateParentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.parentServiceUrl}/parents/${id}`, updateParentDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update parent ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update parent',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
