import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginDto, RegisterDto } from '../../../../shared/src/dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async login(loginDto: LoginDto) {
    try {
      this.logger.log(`Login attempt for: ${loginDto.email}`);
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Login failed for: ${loginDto.email}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Login failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log(`[API GATEWAY] Registration request received - Role: ${registerDto.role}, Email: ${registerDto.email}, Name: ${registerDto.firstName} ${registerDto.lastName}`);
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/register`, registerDto),
      );
      this.logger.log(`[API GATEWAY] Registration successful - Email: ${registerDto.email}, Role: ${registerDto.role}, User ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`[API GATEWAY] Registration failed - Email: ${registerDto.email}, Role: ${registerDto.role}, Error: ${error.message}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Registration failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/refresh`, { refreshToken }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Token refresh failed', error.stack);
      throw new HttpException(
        error.response?.data || 'Token refresh failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Get profile failed', error.stack);
      throw new HttpException(
        error.response?.data || 'Get profile failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(userId: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Get user ${userId} failed`, error.stack);
      throw new HttpException(
        error.response?.data || 'Get user failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
