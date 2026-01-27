import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommunicationService {
  private readonly logger = new Logger(CommunicationService.name);
  private readonly communicationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.communicationServiceUrl = this.configService.get<string>('COMMUNICATION_SERVICE_URL') || 'http://localhost:3009';
  }

  async getNotices(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.communicationServiceUrl}/communications/notices`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get notices', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get notices',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNotice(createNoticeDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.communicationServiceUrl}/communications/notices`, {
          ...createNoticeDto,
          schoolId: user.schoolId,
          createdBy: user.userId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create notice', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create notice',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessages(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.communicationServiceUrl}/communications/messages`, {
          params: { ...query, userId: user.userId, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get messages', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get messages',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMessage(sendMessageDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.communicationServiceUrl}/communications/messages`, {
          ...sendMessageDto,
          fromUserId: user.userId,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to send message', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to send message',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
