import { Controller, Get, Post, Put, Delete, Body, Query, UseGuards, Request } from '@nestjs/common'
import { DataService } from './data.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('api/data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private data: DataService) {}

  @Get()
  async findAll(@Query() q: { page?: string; limit?: string; search?: string; dateFrom?: string; dateTo?: string }) {
    const result = await this.data.findAll({ page: Number(q.page) || 1, limit: Number(q.limit) || 10, search: q.search || '', dateFrom: q.dateFrom, dateTo: q.dateTo })
    return { status: 'success', data: result }
  }

  @Post()
  async create(@Body() body: { rowNumber?: number; value: string; date: string }) {
    const item = await this.data.create(body)
    return { status: 'success', data: item }
  }

  @Put()
  async update(@Query('id') id: string, @Body() body: { rowNumber?: number; value?: string; date?: string }) {
    const item = await this.data.update(parseInt(id), body)
    return { status: 'success', data: item }
  }

  @Delete()
  async delete(@Query('id') id: string) {
    await this.data.delete(parseInt(id))
    return { status: 'success', data: { deleted: true } }
  }
}
