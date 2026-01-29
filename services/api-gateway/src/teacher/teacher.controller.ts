import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../../../shared/src/decorators/roles.decorator';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { UserRole, Permission } from '../../../../shared/src/enums/roles.enum';
@Controller('teachers')
@UseGuards(JwtAuthGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @RequirePermissions(Permission.MANAGE_TEACHERS, Permission.VIEW_ASSIGNED_CLASSES)
  async getAllTeachers(@Query() query: any, @Request() req) {
    return this.teacherService.getAllTeachers(query, req.user);
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_TEACHERS, Permission.VIEW_ASSIGNED_CLASSES)
  async getTeacher(@Param('id') id: string, @Request() req) {
    return this.teacherService.getTeacher(id, req.user);
  }

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_TEACHERS)
  async createTeacher(@Body() createTeacherDto: any, @Request() req) {
    return this.teacherService.createTeacher(createTeacherDto, req.user);
  }

  @Put(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_TEACHERS)
  async updateTeacher(@Param('id') id: string, @Body() updateTeacherDto: any, @Request() req) {
    return this.teacherService.updateTeacher(id, updateTeacherDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_TEACHERS)
  async deleteTeacher(@Param('id') id: string, @Request() req) {
    return this.teacherService.deleteTeacher(id, req.user);
  }
}
