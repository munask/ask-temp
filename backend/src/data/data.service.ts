import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DataService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number; search?: string; dateFrom?: string; dateTo?: string }) {
    const { page = 1, limit = 10, search = '', dateFrom, dateTo } = params
    const skip = (page - 1) * limit
    const where: any = {}

    if (search) where.OR = [{ value: { contains: search, mode: 'insensitive' } }]
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = new Date(dateFrom)
      if (dateTo) where.date.lte = new Date(dateTo + 'T23:59:59')
    }

    const [items, total] = await Promise.all([
      this.prisma.dataRecord.findMany({ where, skip, take: limit, orderBy: { rowNumber: 'asc' } }),
      this.prisma.dataRecord.count({ where }),
    ])

    return { items, pagination: { current_page: page, per_page: limit, total_items: total, total_pages: Math.ceil(total / limit) } }
  }

  async create(data: { rowNumber?: number; value: string; date: string }) {
    if (!data.rowNumber) {
      const max = await this.prisma.dataRecord.aggregate({ _max: { rowNumber: true } })
      data.rowNumber = (max._max.rowNumber || 0) + 1
    }
    return this.prisma.dataRecord.create({ data: { rowNumber: data.rowNumber, value: data.value, date: new Date(data.date) } })
  }

  async update(id: number, data: { rowNumber?: number; value?: string; date?: string }) {
    return this.prisma.dataRecord.update({ where: { id }, data: { ...(data.rowNumber !== undefined && { rowNumber: data.rowNumber }), ...(data.value !== undefined && { value: data.value }), ...(data.date !== undefined && { date: new Date(data.date) }) } })
  }

  async delete(id: number) {
    await this.prisma.dataRecord.delete({ where: { id } })
    return { deleted: true }
  }
}
