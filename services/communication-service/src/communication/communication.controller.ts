import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Controller('communications')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Get('notices')
  async getNotices(@Query() query: any) {
    return this.communicationService.getNotices(query);
  }

  @Post('notices')
  async createNotice(@Body() dto: any) {
    return this.communicationService.createNotice(dto);
  }

  @Get('messages')
  async getMessages(@Query() query: any) {
    return this.communicationService.getMessages(query);
  }

  @Post('messages')
  async sendMessage(@Body() dto: any) {
    return this.communicationService.sendMessage(dto);
  }
}
