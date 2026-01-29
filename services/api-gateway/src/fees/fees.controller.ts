import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
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

  @Get(':id')
  @RequirePermissions(Permission.MANAGE_FEES, Permission.VIEW_FEES)
  async getFee(@Param('id') id: string, @Request() req) {
    return this.feesService.getFee(id, req.user);
  }

  @Post()
  @RequirePermissions(Permission.MANAGE_FEES)
  async createFeeStructure(@Body() createFeeDto: any, @Request() req) {
    return this.feesService.createFeeStructure(createFeeDto, req.user);
  }

  @Put(':id')
  @RequirePermissions(Permission.MANAGE_FEES)
  async updateFee(@Param('id') id: string, @Body() updateFeeDto: any, @Request() req) {
    return this.feesService.updateFee(id, updateFeeDto, req.user);
  }

  @Delete(':id')
  @RequirePermissions(Permission.MANAGE_FEES)
  async deleteFee(@Param('id') id: string, @Request() req) {
    return this.feesService.deleteFee(id, req.user);
  }

  @Post(':id/payment')
  @RequirePermissions(Permission.MANAGE_FEES)
  async recordPayment(@Param('id') id: string, @Body() paymentDto: any, @Request() req) {
    return this.feesService.recordPayment(id, paymentDto, req.user);
  }
}
