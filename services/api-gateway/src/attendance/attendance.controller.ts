import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { Permission } from '../../../../shared/src/enums/roles.enum';
import { RbacGuard } from '../../../../shared/src/guards/rbac.guard';

@Controller('attendances')
@UseGuards(JwtAuthGuard, RbacGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @RequirePermissions(Permission.TAKE_ATTENDANCE)
  async markAttendance(@Body() markAttendanceDto: any, @Request() req) {
    return this.attendanceService.markAttendance(markAttendanceDto, req.user);
  }

  @Get()
  @RequirePermissions(Permission.VIEW_ATTENDANCE, Permission.VIEW_CHILD_ATTENDANCE)
  async getAttendance(@Query() query: any, @Request() req) {
    return this.attendanceService.getAttendance(query, req.user);
  }

  @Get(':id')
  @RequirePermissions(Permission.VIEW_ATTENDANCE, Permission.VIEW_CHILD_ATTENDANCE)
  async getAttendanceById(@Param('id') id: string, @Request() req) {
    return this.attendanceService.getAttendanceById(id, req.user);
  }

  @Put(':id')
  @RequirePermissions(Permission.TAKE_ATTENDANCE)
  async updateAttendance(@Param('id') id: string, @Body() updateAttendanceDto: any, @Request() req) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto, req.user);
  }

  @Delete(':id')
  @RequirePermissions(Permission.TAKE_ATTENDANCE)
  async deleteAttendance(@Param('id') id: string, @Request() req) {
    return this.attendanceService.deleteAttendance(id, req.user);
  }
}
