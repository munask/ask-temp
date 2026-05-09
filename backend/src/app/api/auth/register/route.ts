import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: NextRequest) {
  try {
    const { fullName, userName, role } = await req.json()

    if (!fullName || !userName) {
      return errorResponse('Full name and username are required', 400)
    }

    const existing = await prisma.user.findUnique({ where: { userName } })
    if (existing) {
      return errorResponse('Username already exists', 409)
    }

    const defaultPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        userName,
        password: hashedPassword,
        role: role || 'viewer',
        isTempPass: true,
      },
    })

    return successResponse({
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      role: user.role,
      isTempPass: user.isTempPass,
      defaultPassword,
    })
  } catch (error) {
    console.error('Register error:', error)
    return errorResponse('Internal server error', 500)
  }
}
