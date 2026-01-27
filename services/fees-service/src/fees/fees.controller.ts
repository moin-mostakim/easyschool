import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeesService } from './fees.service';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.feesService.findAll(query);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.feesService.create(dto);
  }

  @Post(':id/payment')
  async recordPayment(@Param('id') id: string, @Body() dto: any) {
    return this.feesService.recordPayment(id, dto);
  }
}
