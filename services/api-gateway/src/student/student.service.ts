import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);
  private readonly studentServiceUrl: string;
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.studentServiceUrl = this.configService.get<string>('STUDENT_SERVICE_URL') || 'http://localhost:3003';
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  }

  async getAllStudents(query: any, user: any) {
    try {
      // For super_admin, use schoolId from query if provided, otherwise don't filter by schoolId
      const params: any = { ...query };
      if (user.role !== 'super_admin' && user.schoolId) {
        params.schoolId = user.schoolId;
      }
      // If super_admin provides schoolId in query, use it
      if (user.role === 'super_admin' && query.schoolId) {
        params.schoolId = query.schoolId;
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.studentServiceUrl}/students`, {
          params,
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get students', error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get students',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStudent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.studentServiceUrl}/students/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to get student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to get student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createStudent(createStudentDto: any, user: any) {
    try {
      // Use schoolId from DTO if provided (for super_admin), otherwise use user's schoolId
      const schoolId = createStudentDto.schoolId || user.schoolId;
      
      if (!schoolId) {
        throw new HttpException('School ID is required', HttpStatus.BAD_REQUEST);
      }

      // Generate a temporary password for the student user
      const tempPassword = `Temp${Math.random().toString(36).substr(2, 9)}!`;
      
      // Step 1: Create a User account for the student
      let userId: string;
      try {
        const userResponse = await firstValueFrom(
          this.httpService.post(`${this.authServiceUrl}/auth/register`, {
            email: createStudentDto.email,
            password: tempPassword,
            firstName: createStudentDto.firstName,
            lastName: createStudentDto.lastName,
            role: 'student',
            schoolId: schoolId,
          }, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        );
        userId = userResponse.data.id;
        this.logger.log(`Created user for student: ${createStudentDto.email}`);
      } catch (userError: any) {
        this.logger.error('Failed to create user for student', userError.stack);
        // If user already exists, try to find the user by email
        if (userError.response?.status === 409) {
          throw new HttpException(
            `A user with email ${createStudentDto.email} already exists`,
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          userError.response?.data || 'Failed to create user for student',
          userError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
      // Step 2: Generate admission number if not provided
      const admissionNumber = createStudentDto.admissionNumber || 
        `ADM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Step 3: Create the Student record
      const studentData = {
        userId: userId,
        schoolId: schoolId,
        admissionNumber: admissionNumber,
        dateOfBirth: createStudentDto.dateOfBirth || null,
        classId: createStudentDto.classId || null,
        sectionId: createStudentDto.sectionId || null,
        grade: createStudentDto.grade || null,
        section: createStudentDto.section || null,
        parentId: createStudentDto.parentId || null,
        gender: createStudentDto.gender || null,
        address: createStudentDto.address || null,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.studentServiceUrl}/students`, studentData, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      
      // Return student data with user info
      return {
        ...response.data,
        email: createStudentDto.email,
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
      };
    } catch (error: any) {
      this.logger.error('Failed to create student', error.stack);
      this.logger.error('Student data:', JSON.stringify(createStudentDto, null, 2));
      throw new HttpException(
        error.response?.data || error.message || 'Failed to create student',
        error.response?.status || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStudent(id: string, updateStudentDto: any, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.studentServiceUrl}/students/${id}`, updateStudentDto, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to update student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteStudent(id: string, user: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.studentServiceUrl}/students/${id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete student ${id}`, error.stack);
      throw new HttpException(
        error.response?.data || 'Failed to delete student',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
