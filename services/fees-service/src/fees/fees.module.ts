import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';
import { Fee } from './entities/fee.entity';
import { FeePayment } from './entities/fee-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fee, FeePayment])],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
