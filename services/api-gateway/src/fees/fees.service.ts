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

  async getFee(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.feesServiceUrl}/fees/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get fee ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get fee',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFeeStructure(createFeeDto: any, user: any) {
    try {
      const schoolId = createFeeDto.schoolId || user.schoolId;
      
      if (!schoolId) {
        throw new HttpException('School ID is required', HttpStatus.BAD_REQUEST);
      }

      // Ensure required fields are present
      if (!createFeeDto.studentId) {
        throw new HttpException('Student ID is required', HttpStatus.BAD_REQUEST);
      }
      if (!createFeeDto.name) {
        throw new HttpException('Fee name is required', HttpStatus.BAD_REQUEST);
      }
      if (createFeeDto.amount === undefined || createFeeDto.amount === null) {
        throw new HttpException('Fee amount is required', HttpStatus.BAD_REQUEST);
      }
      if (!createFeeDto.dueDate) {
        throw new HttpException('Due date is required', HttpStatus.BAD_REQUEST);
      }

      const response = await firstValueFrom(
        this.httpService.post(`${this.feesServiceUrl}/fees`, {
          ...createFeeDto,
          schoolId: schoolId,
          isPaid: createFeeDto.isPaid || false,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      // Return ALL submitted data from frontend
      return {
        ...response.data,
        studentId: createFeeDto.studentId,
        amount: createFeeDto.amount,
        dueDate: createFeeDto.dueDate,
        description: createFeeDto.description || response.data.description,
        name: createFeeDto.name || response.data.name,
        schoolId: schoolId,
        isPaid: createFeeDto.isPaid || false,
      };
    } catch (error: any) {
      this.logger.error('Failed to create fee structure', error.stack);
      this.logger.error('Fee data:', JSON.stringify(createFeeDto, null, 2));
      throw new HttpException(
        error.response?.data || error.message || 'Failed to create fee structure',
        error.response?.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFee(id: string, updateFeeDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.feesServiceUrl}/fees/${id}`, {
          ...updateFeeDto,
          schoolId: user.schoolId,
        }, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      // Return ALL submitted data from frontend
      return {
        ...response.data,
        studentId: updateFeeDto.studentId || response.data.studentId,
        amount: updateFeeDto.amount || response.data.amount,
        dueDate: updateFeeDto.dueDate || response.data.dueDate,
        description: updateFeeDto.description || response.data.description,
        name: updateFeeDto.name || response.data.name,
      };
    } catch (error) {
      this.logger.error(`Failed to update fee ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update fee',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFee(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.feesServiceUrl}/fees/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete fee ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete fee',
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
