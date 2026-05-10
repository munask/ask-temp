import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('api/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Post()
  create(@Body() body: { name: string; displayName: string; description?: string }) {
    return this.rolesService.create(body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { displayName?: string; description?: string }) {
    return this.rolesService.update(id, body)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.rolesService.delete(id)
  }

  @Put(':id/permissions')
  setPermissions(@Param('id') id: string, @Body() body: { permissions: { resource: string; action: string }[] }) {
    return this.rolesService.setPermissions(id, body.permissions)
  }

  @Get(':id/users')
  getUsers(@Param('id') id: string) {
    return this.rolesService.getUsersByRole(id)
  }
}
