import { NextResponse } from 'next/server'

interface ApiResponse<T> {
  status: 'success' | 'error'
  message?: string
  data: T
  errors?: unknown[]
}

interface Pagination {
  current_page: number
  per_page: number
  total_items: number
  total_pages: number
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json({ status: 'success', message, data } as ApiResponse<T>, { status: 200 })
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json({ status: 'success', message, data } as ApiResponse<T>, { status: 201 })
}

export function paginatedResponse<T>(items: T[], pagination: Pagination) {
  return NextResponse.json({
    status: 'success',
    data: { items, pagination },
  }, { status: 200 })
}

export function errorResponse(message: string, status = 400, errors?: unknown[]) {
  return NextResponse.json({ status: 'error', message, errors } as ApiResponse<null>, { status })
}
