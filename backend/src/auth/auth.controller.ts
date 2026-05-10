import { Controller, Post, Put, Body, UseGuards, Request, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { userName: string; password: string }) {
    const result = await this.auth.login(body.userName, body.password)
    if (!result) return { status: 'error', message: 'Invalid credentials' }
    return { status: 'success', data: result }
  }

  @Post('register')
  async register(@Body() body: { fullName: string; userName: string; role?: string }) {
    const result = await this.auth.register(body.fullName, body.userName, body.role)
    return { status: 'success', data: result }
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Request() req: any, @Body() body: { currentPassword: string; newPassword: string }) {
    const ok = await this.auth.changePassword(req.user.userId, body.currentPassword, body.newPassword)
    return ok ? { status: 'success', data: { success: true } } : { status: 'error', message: 'Incorrect password' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Request() req: any, @Query() q: { page?: string; limit?: string; search?: string }) {
    const page = parseInt(q.page || '1')
    const limit = parseInt(q.limit || '10')
    const skip = (page - 1) * limit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = q.search ? { OR: [{ fullName: { contains: q.search } }, { userName: { contains: q.search } }] } : {}
    const [items, total] = await Promise.all([
      this.auth.prisma.user.findMany({ where, skip, take: limit, orderBy: { id: 'desc' }, select: { id: true, userName: true, fullName: true, role: true, isTempPass: true, createdAt: true } }),
      this.auth.prisma.user.count({ where }),
    ])
    return { status: 'success', data: { items, pagination: { current_page: page, per_page: limit, total_items: total, total_pages: Math.ceil(total / limit) } } }
  }
}
