import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
@Module({
  imports: [HttpModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
