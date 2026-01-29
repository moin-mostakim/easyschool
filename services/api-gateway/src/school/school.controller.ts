import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../../../shared/src/decorators/roles.decorator';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { UserRole, Permission } from '../../../../shared/src/enums/roles.enum';
import { RbacGuard } from '../../../../shared/src/guards/rbac.guard';

@Controller('schools')
@UseGuards(JwtAuthGuard, RbacGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @RequirePermissions(Permission.MANAGE_ALL_SCHOOLS)
  async getAllSchools(@Query() query: any) {
    return this.schoolService.getAllSchools(query);
  }

  @Get(':id')
  async getSchool(@Param('id') id: string, @Request() req) {
    return this.schoolService.getSchool(id, req.user);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @RequirePermissions(Permission.APPROVE_SCHOOLS)
  async createSchool(@Body() createSchoolDto: any) {
    return this.schoolService.createSchool(createSchoolDto);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  @RequirePermissions(Permission.MANAGE_SCHOOL_PROFILE)
  async updateSchool(@Param('id') id: string, @Body() updateSchoolDto: any, @Request() req) {
    return this.schoolService.updateSchool(id, updateSchoolDto, req.user);
  }

  @Post(':id/approve')
  @Roles(UserRole.SUPER_ADMIN)
  @RequirePermissions(Permission.APPROVE_SCHOOLS)
  async approveSchool(@Param('id') id: string) {
    return this.schoolService.approveSchool(id);
  }

  @Post(':id/suspend')
  @Roles(UserRole.SUPER_ADMIN)
  @RequirePermissions(Permission.SUSPEND_SCHOOLS)
  async suspendSchool(@Param('id') id: string) {
    return this.schoolService.suspendSchool(id);
  }
}
