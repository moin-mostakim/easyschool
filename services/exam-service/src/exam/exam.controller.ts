import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ExamService } from './exam.service';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.examService.findAll(query);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.examService.create(dto);
  }

  @Post(':id/marks')
  async enterMarks(@Param('id') id: string, @Body() dto: any) {
    return this.examService.enterMarks(id, dto);
  }

  @Get(':id/results')
  async getResults(@Param('id') id: string, @Query() query: any) {
    return this.examService.getResults(id, query);
  }
}
