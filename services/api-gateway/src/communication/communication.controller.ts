import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { Permission } from '../../../../shared/src/enums/roles.enum';
import { RbacGuard } from '../../../../shared/src/guards/rbac.guard';

@Controller('communications')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Get('notices')
  @RequirePermissions(Permission.VIEW_NOTICES, Permission.VIEW_OWN_NOTICES, Permission.SEND_NOTICES)
  async getNotices(@Query() query: any, @Request() req) {
    return this.communicationService.getNotices(query, req.user);
  }

  @Post('notices')
  @RequirePermissions(Permission.SEND_NOTICES, Permission.SEND_CLASS_NOTICES)
  async createNotice(@Body() createNoticeDto: any, @Request() req) {
    return this.communicationService.createNotice(createNoticeDto, req.user);
  }

  @Get('messages')
  @RequirePermissions(Permission.COMMUNICATE_PARENTS, Permission.COMMUNICATE_TEACHERS)
  async getMessages(@Query() query: any, @Request() req) {
    return this.communicationService.getMessages(query, req.user);
  }

  @Post('messages')
  @RequirePermissions(Permission.COMMUNICATE_PARENTS, Permission.COMMUNICATE_TEACHERS)
  async sendMessage(@Body() sendMessageDto: any, @Request() req) {
    return this.communicationService.sendMessage(sendMessageDto, req.user);
  }
}
