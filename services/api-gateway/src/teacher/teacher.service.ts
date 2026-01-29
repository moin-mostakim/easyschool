import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name);
  private readonly teacherServiceUrl: string;
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.teacherServiceUrl = this.configService.get<string>('TEACHER_SERVICE_URL') || 'http://localhost:3004';
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async getAllTeachers(query: any, user: any) {
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
        this.httpService.get(`${this.teacherServiceUrl}/teachers`, {
          params,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Fetch user info for teachers to include name and email
      if (response.data?.data && Array.isArray(response.data.data)) {
        const teachersWithUserInfo = await Promise.all(
          response.data.data.map(async (teacher: any) => {
            try {
              const userResponse = await firstValueFrom(
                this.httpService.get(`${this.authServiceUrl}/auth/users/${teacher.userId}`, {
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }),
              );
              return {
                ...teacher,
                email: userResponse.data.email,
                firstName: userResponse.data.firstName,
                lastName: userResponse.data.lastName,
              };
            } catch (error) {
              this.logger.warn(`Failed to fetch user info for teacher ${teacher.userId}`);
              return teacher;
            }
          }),
        );
        return {
          ...response.data,
          data: teachersWithUserInfo,
        };
      }
      
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
        this.logger.warn(`Failed to fetch user info for teacher ${id}`);
        return response.data;
      }
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
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
      const schoolId = createTeacherDto.schoolId || user.schoolId;
      
      if (!schoolId) {
        throw new HttpException('School ID is required', HttpStatus.BAD_REQUEST);
      }

      // Generate a temporary password for the teacher user
      const tempPassword = `Temp${Math.random().toString(36).substr(2, 9)}!`;
      
      // Step 1: Create a User account for the teacher
      let userId: string;
      try {
        const userResponse = await firstValueFrom(
          this.httpService.post(`${authServiceUrl}/auth/register`, {
            email: createTeacherDto.email,
            password: tempPassword,
            firstName: createTeacherDto.firstName,
            lastName: createTeacherDto.lastName,
            role: 'teacher',
            schoolId: schoolId,
          }, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        );
        userId = userResponse.data.id;
        this.logger.log(`Created user for teacher: ${createTeacherDto.email}`);
      } catch (userError: any) {
        this.logger.error('Failed to create user for teacher', userError.stack);
        if (userError.response?.status === 409) {
          throw new HttpException(
            `A user with email ${createTeacherDto.email} already exists`,
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          userError.response?.data || 'Failed to create user for teacher',
          userError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      // Step 2: Generate employee ID if not provided
      const employeeId = createTeacherDto.employeeId || 
        `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Step 3: Create the Teacher record
      const teacherData = {
        userId: userId,
        schoolId: schoolId,
        employeeId: employeeId,
        assignedClasses: createTeacherDto.assignedClasses || [],
        assignedSubjects: createTeacherDto.assignedSubjects || [],
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.teacherServiceUrl}/teachers`, teacherData, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Return teacher data with user info
      return {
        ...response.data,
        email: createTeacherDto.email,
        firstName: createTeacherDto.firstName,
        lastName: createTeacherDto.lastName,
      };
    } catch (error: any) {
      this.logger.error('Failed to create teacher', error.stack);
      this.logger.error('Teacher data:', JSON.stringify(createTeacherDto, null, 2));
      throw new HttpException(
        error.response?.data || error.message || 'Failed to create teacher',
        error.response?.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
