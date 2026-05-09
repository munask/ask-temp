import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, createdResponse, paginatedResponse, errorResponse } from '@/lib/response'

// GET /api/data?page=&limit=&search=&dateFrom=&dateTo=
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { value: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom)
      if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo + 'T23:59:59')
    }

    const [records, total] = await Promise.all([
      prisma.dataRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rowNumber: 'asc' },
      }),
      prisma.dataRecord.count({ where }),
    ])

    return paginatedResponse(records, {
      current_page: page,
      per_page: limit,
      total_items: total,
      total_pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get data error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// POST /api/data - Create new record
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { rowNumber, value, date } = await req.json()

    if (!value || !date) {
      return errorResponse('value and date are required', 400)
    }

    let finalRowNumber = rowNumber
    if (!rowNumber) {
      const maxRow = await prisma.dataRecord.aggregate({ _max: { rowNumber: true } })
      finalRowNumber = (maxRow._max.rowNumber || 0) + 1
    }

    const record = await prisma.dataRecord.create({
      data: {
        rowNumber: finalRowNumber,
        value,
        date: new Date(date),
      },
    })

    return createdResponse(record)
  } catch (error) {
    console.error('Create data error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// PUT /api/data?id=
export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return errorResponse('Record ID is required', 400)

    const { rowNumber, value, date } = await req.json()

    const record = await prisma.dataRecord.update({
      where: { id: parseInt(id) },
      data: {
        ...(rowNumber !== undefined && { rowNumber }),
        ...(value !== undefined && { value }),
        ...(date !== undefined && { date: new Date(date) }),
      },
    })

    return successResponse(record)
  } catch (error) {
    console.error('Update data error:', error)
    return errorResponse('Internal server error', 500)
  }
}

// DELETE /api/data?id=
export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return errorResponse('Record ID is required', 400)

    await prisma.dataRecord.delete({ where: { id: parseInt(id) } })

    return successResponse({ deleted: true })
  } catch (error) {
    console.error('Delete data error:', error)
    return errorResponse('Internal server error', 500)
  }
}
