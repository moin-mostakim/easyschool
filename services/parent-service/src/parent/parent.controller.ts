import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ParentService } from './parent.service';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.parentService.findAll(query);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.parentService.findOne(id);
  }

  @Post()
  async create(@Body() dto: any) {
    return this.parentService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.parentService.update(id, dto);
  }
}
