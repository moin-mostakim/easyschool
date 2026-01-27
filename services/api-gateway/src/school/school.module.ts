import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
  imports: [HttpModule],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
