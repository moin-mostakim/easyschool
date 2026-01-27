import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { FeesService } from './fees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../../../shared/src/decorators/roles.decorator';
import { Permission } from '../../../../shared/src/enums/roles.enum';

@Controller('fees')
@UseGuards(JwtAuthGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  @RequirePermissions(Permission.MANAGE_FEES, Permission.VIEW_FEES)
  async getFees(@Query() query: any, @Request() req) {
    return this.feesService.getFees(query, req.user);
  }

  @Post()
  @RequirePermissions(Permission.MANAGE_FEES)
  async createFeeStructure(@Body() createFeeDto: any, @Request() req) {
    return this.feesService.createFeeStructure(createFeeDto, req.user);
  }

  @Post(':id/payment')
  @RequirePermissions(Permission.MANAGE_FEES)
  async recordPayment(@Param('id') id: string, @Body() paymentDto: any, @Request() req) {
    return this.feesService.recordPayment(id, paymentDto, req.user);
  }
}
