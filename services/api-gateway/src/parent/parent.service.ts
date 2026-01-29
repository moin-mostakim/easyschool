import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ParentService {
  private readonly logger = new Logger(ParentService.name);
  private readonly parentServiceUrl: string;
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.parentServiceUrl = this.configService.get<string>('PARENT_SERVICE_URL') || 'http://localhost:3005';
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async getAllParents(query: any, user: any) {
    try {
      const params: any = { ...query };
      // For super_admin, allow filtering by schoolId from query
      if (user.role !== 'super_admin' && user.schoolId) {
        params.schoolId = user.schoolId;
      }
      if (user.role === 'super_admin' && query.schoolId) {
        params.schoolId = query.schoolId;
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.parentServiceUrl}/parents`, {
          params,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Fetch user info for parents to include name and email
      if (response.data?.data && Array.isArray(response.data.data)) {
        const parentsWithUserInfo = await Promise.all(
          response.data.data.map(async (parent: any) => {
            try {
              const userResponse = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/auth/users/${parent.userId}`, {
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }),
              );
              return {
                ...parent,
                email: userResponse.data.email,
                firstName: userResponse.data.firstName,
                lastName: userResponse.data.lastName,
              };
            } catch (error) {
              this.logger.warn(`Failed to fetch user info for parent ${parent.userId}`);
              return parent;
            }
          }),
        );
        return {
          ...response.data,
          data: parentsWithUserInfo,
        };
      }
      
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
      
      // Fetch user info to include name and email
      try {
        const userResponse = await firstValueFrom(
          this.httpService.get(`${this.authServiceUrl}/auth/users/${response.data.userId}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        );
        return {
          ...response.data,
          email: userResponse.data.email,
          firstName: userResponse.data.firstName,
          lastName: userResponse.data.lastName,
        };
      } catch (error) {
        this.logger.warn(`Failed to fetch user info for parent ${id}`);
        return response.data;
      }
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
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
      const schoolId = createParentDto.schoolId || user.schoolId;
      
      if (!schoolId) {
        throw new HttpException('School ID is required', HttpStatus.BAD_REQUEST);
      }

      // Generate a temporary password for the parent user
      const tempPassword = `Temp${Math.random().toString(36).substr(2, 9)}!`;
      
      // Step 1: Create a User account for the parent
      let userId: string;
      try {
        const userResponse = await firstValueFrom(
          this.httpService.post(`${authServiceUrl}/auth/register`, {
            email: createParentDto.email,
            password: tempPassword,
            firstName: createParentDto.firstName,
            lastName: createParentDto.lastName,
            role: 'parent',
            schoolId: schoolId,
          }, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        );
        userId = userResponse.data.id;
        this.logger.log(`Created user for parent: ${createParentDto.email}`);
      } catch (userError: any) {
        this.logger.error('Failed to create user for parent', userError.stack);
        if (userError.response?.status === 409) {
          throw new HttpException(
            `A user with email ${createParentDto.email} already exists`,
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          userError.response?.data || 'Failed to create user for parent',
          userError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      // Step 2: Create the Parent record
      const parentData = {
        userId: userId,
        schoolId: schoolId,
        childrenIds: createParentDto.childrenIds || [],
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.parentServiceUrl}/parents`, parentData, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Return parent data with ALL submitted fields from frontend
      return {
        ...response.data,
        email: createParentDto.email,
        firstName: createParentDto.firstName,
        lastName: createParentDto.lastName,
        phone: createParentDto.phone || response.data.phone,
        relationship: createParentDto.relationship || response.data.relationship,
        schoolId: schoolId,
      };
    } catch (error: any) {
      this.logger.error('Failed to create parent', error.stack);
      this.logger.error('Parent data:', JSON.stringify(createParentDto, null, 2));
      throw new HttpException(
        error.response?.data || error.message || 'Failed to create parent',
        error.response?.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateParent(id: string, updateParentDto: any, user: any) {
    try {
      // First get the current parent to preserve userId
      const currentParent = await firstValueFrom(
        this.httpService.get(`${this.parentServiceUrl}/parents/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      const response = await firstValueFrom(
        this.httpService.put(`${this.parentServiceUrl}/parents/${id}`, updateParentDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Fetch user info to include name and email
      try {
        const userResponse = await firstValueFrom(
          this.httpService.get(`${this.authServiceUrl}/auth/users/${currentParent.data.userId}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        );
        return {
          ...response.data,
          email: userResponse.data?.email || updateParentDto.email,
          firstName: userResponse.data?.firstName || updateParentDto.firstName,
          lastName: userResponse.data?.lastName || updateParentDto.lastName,
          phone: updateParentDto.phone || response.data.phone,
          relationship: updateParentDto.relationship || response.data.relationship,
        };
      } catch (error) {
        this.logger.warn(`Failed to fetch user info for parent ${id}`);
        return {
          ...response.data,
          email: updateParentDto.email,
          firstName: updateParentDto.firstName,
          lastName: updateParentDto.lastName,
          phone: updateParentDto.phone || response.data.phone,
          relationship: updateParentDto.relationship || response.data.relationship,
        };
      }
    } catch (error) {
      this.logger.error(`Failed to update parent ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update parent',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteParent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.parentServiceUrl}/parents/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete parent ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete parent',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
