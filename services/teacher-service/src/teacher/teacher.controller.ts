import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { TeacherService } from './teacher.service';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.teacherService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.teacherService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.teacherService.update(id, dto);
  }
}
