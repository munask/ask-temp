import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    })
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
      include: { permissions: true },
    })
  }

  async create(data: { name: string; displayName: string; description?: string }) {
    return this.prisma.role.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description,
      },
      include: { permissions: true },
    })
  }

  async update(id: string, data: { displayName?: string; description?: string }) {
    return this.prisma.role.update({
      where: { id },
      data: {
        displayName: data.displayName,
        description: data.description,
      },
      include: { permissions: true },
    })
  }

  async delete(id: string) {
    // Check if role has users
    const usersCount = await this.prisma.user.count({ where: { roleId: id } })
    if (usersCount > 0) {
      throw new Error(`Cannot delete role: ${usersCount} user(s) are assigned to this role`)
    }
    return this.prisma.role.delete({ where: { id } })
  }

  async setPermissions(id: string, permissions: { resource: string; action: string }[]) {
    // Delete existing permissions
    await this.prisma.permission.deleteMany({ where: { roleId: id } })
    // Create new ones
    if (permissions.length === 0) return this.prisma.role.findUnique({ where: { id }, include: { permissions: true } })
    return this.prisma.role.update({
      where: { id },
      data: {
        permissions: {
          create: permissions,
        },
      },
      include: { permissions: true },
    })
  }

  async getUsersByRole(roleId: string) {
    return this.prisma.user.findMany({
      where: { roleId },
      select: { id: true, userName: true, fullName: true, role: true },
    })
  }
}
