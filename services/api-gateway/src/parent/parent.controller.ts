import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ParentService } from './parent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('parents')
@UseGuards(JwtAuthGuard)
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  async getAllParents(@Query() query: any, @Request() req) {
    return this.parentService.getAllParents(query, req.user);
  }

  @Get(':id')
  async getParent(@Param('id') id: string, @Request() req) {
    return this.parentService.getParent(id, req.user);
  }

  @Post()
  async createParent(@Body() createParentDto: any, @Request() req) {
    return this.parentService.createParent(createParentDto, req.user);
  }

  @Put(':id')
  async updateParent(@Param('id') id: string, @Body() updateParentDto: any, @Request() req) {
    return this.parentService.updateParent(id, updateParentDto, req.user);
  }

  @Delete(':id')
  async deleteParent(@Param('id') id: string, @Request() req) {
    return this.parentService.deleteParent(id, req.user);
  }
}
