import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { Notice } from './entities/notice.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notice, Message])],
  controllers: [CommunicationController],
  providers: [CommunicationService],
})
export class CommunicationModule {}
