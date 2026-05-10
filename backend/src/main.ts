import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
  await app.listen(5000)
  console.log('Backend running on http://localhost:5000')
}
bootstrap()
