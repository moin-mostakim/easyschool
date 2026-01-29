import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../../../shared/src/decorators/roles.decorator';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { UserRole, Permission } from '../../../../shared/src/enums/roles.enum';
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @RequirePermissions(Permission.MANAGE_STUDENTS, Permission.VIEW_STUDENT_DATA)
  async getAllStudents(@Query() query: any, @Request() req) {
    return this.studentService.getAllStudents(query, req.user);
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_STUDENTS, Permission.VIEW_STUDENT_DATA)
  async getStudent(@Param('id') id: string, @Request() req) {
    return this.studentService.getStudent(id, req.user);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_STUDENTS)
  async createStudent(@Body() createStudentDto: any, @Request() req) {
    return this.studentService.createStudent(createStudentDto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_STUDENTS)
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: any, @Request() req) {
    return this.studentService.updateStudent(id, updateStudentDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_STUDENTS)
  async deleteStudent(@Param('id') id: string, @Request() req) {
    return this.studentService.deleteStudent(id, req.user);
  }
}
