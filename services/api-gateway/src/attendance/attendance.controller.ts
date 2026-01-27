import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { Permission } from '../../../../shared/src/enums/roles.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
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
}
