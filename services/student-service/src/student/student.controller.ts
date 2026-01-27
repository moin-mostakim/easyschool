import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.studentService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.studentService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.studentService.delete(id);
  }
}
