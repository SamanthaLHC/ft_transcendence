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
import { GameService } from './game/game.service';
import { MasterGateway } from './app.gateway';
import { GameFGateway } from './gamef/gamef.gateway';
import { GameFService } from './gamef/gamef.service';


@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot(), ChatModule],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService, GameGateway, GameService, MasterGateway, GameFGateway, GameFService],
})
export class AppModule {}
