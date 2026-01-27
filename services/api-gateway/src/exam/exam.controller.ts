import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { Permission } from '../../../../shared/src/enums/roles.enum';

@Controller('exams')
@UseGuards(JwtAuthGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  @RequirePermissions(Permission.MANAGE_EXAMS, Permission.VIEW_EXAM_RESULTS, Permission.VIEW_OWN_RESULTS)
  async getExams(@Query() query: any, @Request() req) {
    return this.examService.getExams(query, req.user);
  }

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_EXAMS, Permission.VIEW_EXAM_RESULTS, Permission.VIEW_OWN_RESULTS)
  async getExam(@Param('id') id: string, @Request() req) {
    return this.examService.getExam(id, req.user);
  }

  @Post()
  @RequirePermissions(Permission.MANAGE_EXAMS)
  async createExam(@Body() createExamDto: any, @Request() req) {
    return this.examService.createExam(createExamDto, req.user);
  }

  @Put(':id')
  @RequirePermissions(Permission.MANAGE_EXAMS)
  async updateExam(@Param('id') id: string, @Body() updateExamDto: any, @Request() req) {
    return this.examService.updateExam(id, updateExamDto, req.user);
  }

  @Delete(':id')
  @RequirePermissions(Permission.MANAGE_EXAMS)
  async deleteExam(@Param('id') id: string, @Request() req) {
    return this.examService.deleteExam(id, req.user);
  }

  @Post(':id/marks')
  @RequirePermissions(Permission.ENTER_EXAM_MARKS)
  async enterMarks(@Param('id') id: string, @Body() marksDto: any, @Request() req) {
    return this.examService.enterMarks(id, marksDto, req.user);
  }

  @Get(':id/results')
  @RequirePermissions(Permission.VIEW_EXAM_RESULTS, Permission.VIEW_OWN_RESULTS, Permission.VIEW_PERFORMANCE)
  async getResults(@Param('id') id: string, @Query() query: any, @Request() req) {
    return this.examService.getResults(id, query, req.user);
  }
}
