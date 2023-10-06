import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { ChatModule } from './chat/chat.module';
import { GameGateway } from './game/game.gateway';


@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot(), ChatModule],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService, GameGateway],
})
export class AppModule {}
