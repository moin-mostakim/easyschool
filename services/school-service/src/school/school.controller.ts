import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async getAllSchools(@Query() query: any) {
    return this.schoolService.findAll(query);
  }

  @Get(':id')
  async getSchool(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  @Post()
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Put(':id')
  async updateSchool(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Post(':id/approve')
  async approveSchool(@Param('id') id: string) {
    return this.schoolService.approve(id);
  }

  @Post(':id/suspend')
  async suspendSchool(@Param('id') id: string) {
    return this.schoolService.suspend(id);
  }
}
