import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
              PrismaModule,
              JwtModule.register({
                global: true,
                secret: process.env.JWTSECRET,
                signOptions: {expiresIn: "1d"}
              })
          ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, {provide: APP_GUARD, useClass: AuthGuard}]
})
export class AuthModule {}