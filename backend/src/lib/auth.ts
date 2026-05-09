import { NextRequest } from 'next/server'
import { verifyToken } from './jwt'
import { prisma } from './prisma'

export interface AuthUser {
  id: number
  userName: string
  fullName: string
  role: string
  isTempPass: boolean
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) return null

  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        userName: true,
        fullName: true,
        role: true,
        isTempPass: true,
      },
    })
    return user
  } catch {
    return null
  }
}

export function requireAuth(handler: (req: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (req: NextRequest) => {
    const user = await getAuthUser(req)
    if (!user) {
      return Response.json({ status: 'error', message: 'Unauthorized' }, { status: 401 })
    }
    return handler(req, user)
  }
}
