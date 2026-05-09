import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { successResponse, errorResponse } from '@/lib/response'

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json()

    if (!userName || !password) {
      return errorResponse('Username and password are required', 400)
    }

    const user = await prisma.user.findUnique({
      where: { userName },
    })

    if (!user) {
      return errorResponse('Invalid credentials', 401)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401)
    }

    const token = signToken({ userId: user.id, userName: user.userName })

    return successResponse({
      access_token: token,
      user: {
        id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        roles: [],
        permissions: [],
        isTempPass: user.isTempPass,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Internal server error', 500)
  }
}
