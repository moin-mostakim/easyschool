import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async mark(@Body() dto: any) {
    return this.attendanceService.mark(dto);
  }

  @Get()
  async getAll(@Query() query: any) {
    return this.attendanceService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }
}
