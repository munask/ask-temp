import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/response'

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return errorResponse('Current and new password are required', 400)
    }

    if (newPassword.length < 6) {
      return errorResponse('New password must be at least 6 characters', 400)
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return errorResponse('User not found', 404)

    const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isValidPassword) return errorResponse('Current password is incorrect', 401)

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, isTempPass: false },
    })

    return successResponse({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return errorResponse('Internal server error', 500)
  }
}
