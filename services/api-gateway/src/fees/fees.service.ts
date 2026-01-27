import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FeesService {
  private readonly logger = new Logger(FeesService.name);
  private readonly feesServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.feesServiceUrl = this.configService.get<string>('FEES_SERVICE_URL') || 'http://localhost:3008';
  }

  async getFees(query: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.feesServiceUrl}/fees`, {
          params: { ...query, schoolId: user.schoolId },
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get fees', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get fees',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFeeStructure(createFeeDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.feesServiceUrl}/fees`, {
          ...createFeeDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create fee structure', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to create fee structure',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async recordPayment(feeId: string, paymentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.feesServiceUrl}/fees/${feeId}/payment`, paymentDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to record payment for fee ${feeId}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to record payment',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
