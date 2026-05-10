import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './auth/auth.module'
import { DataModule } from './data/data.module'
import { RolesModule } from './roles/roles.module'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret', signOptions: { expiresIn: '7d' } }),
    AuthModule,
    DataModule,
    RolesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
