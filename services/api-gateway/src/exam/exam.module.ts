import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [HttpModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}
