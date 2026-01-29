import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
@Module({
  imports: [HttpModule],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
