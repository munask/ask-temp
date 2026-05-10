import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(public prisma: PrismaService, private jwt: JwtService) {}

  async login(userName: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { userName },
      include: {
        roleRelation: { include: { permissions: true } },
        permissions: true,
      },
    })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null
    }
    const token = this.jwt.sign({ sub: user.id, userName: user.userName })
    return {
      access_token: token,
      user: {
        id: user.id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        roleId: user.roleId,
        roles: user.roleRelation ? [user.roleRelation] : [],
        permissions: user.permissions.map(p => ({ resource: p.resource, action: p.action })),
        isTempPass: user.isTempPass,
      },
    }
  }

  async register(fullName: string, userName: string, role = 'viewer') {
    const password = Math.random().toString(36).slice(-8)
    const hashed = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({ data: { fullName, userName, password: hashed, role, isTempPass: true } })
    return { ...user, defaultPassword: password }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return false
    }
    await this.prisma.user.update({ where: { id: userId }, data: { password: await bcrypt.hash(newPassword, 10), isTempPass: false } })
    return true
  }
}
