import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Room } from './interface/game.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService, private usersService: UsersService, private prisma: PrismaService) {}
  @WebSocketServer()
  server: Server;
  rooms: Room[]


  roomisfull(id:number): boolean {
    const selectroom = this.rooms[id]
    if (!selectroom)
      return false
    if (selectroom.userone && selectroom.usertwo)
      return true
    else
      return false
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: process.env.JWTSECRET
      }
    );
    const user = await this.prisma.user.findFirst({
      where: {
          id: payload.sub,
      },
    })
    if (!user)
      socket.disconnect
    console.log (`user connect : ${user.name}`)
    if(!this.rooms)
    {
      this.rooms = []
      this.rooms.push({id: 0, userone: user, usertwo: null})
      await this.server.in(socket.id).socketsJoin("0")
    }
    else {
      if (this.roomisfull(this.rooms.length - 1))
      {
        this.rooms.push({id: this.rooms.length, userone: user, usertwo: null})
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
      }
      else {
        this.rooms[this.rooms.length - 1].usertwo = user
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
        this.server.to((this.rooms.length - 1).toString()).emit("lalalalala", `conneted to room id : ${this.rooms.length - 1}`)
      }
    }
  }

  async handleDisconnect(socket: Socket) {
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: process.env.JWTSECRET
      }
    );
    const user = await this.usersService.getUserFromId(payload.sub)
    if (!user)
      socket.disconnect
    console.log (`user disconnect : ${user.name}`)
  }

  getroombyuser(user: User): number
  {
    let i = 0;
    while (this.rooms[i])
    {
      if (this.rooms[i].userone.id === user.id || this.rooms[i].usertwo.id === user.id)
        return i
      i++
    }
    return -1
  }

  @SubscribeMessage('OnKeyDownArrowDown')
  async handleMessage_down(@ConnectedSocket() socket: Socket) {
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: process.env.JWTSECRET
      }
    );
    const user = await this.prisma.user.findFirst({
      where: {
          id: payload.sub,
      },
    })
    if (!user)
      socket.disconnect
    const id = this.getroombyuser(user)
    this.server.to((id).toString()).emit("lalalalala", `user ${user.name} keydownArrowDown`)
    console.log (`user KeyDownArrowDown : ${user.name}`)
  }

  @SubscribeMessage('OnKeyDownArrowUp')
  async handleMessage_up(@ConnectedSocket() socket: Socket) {
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: process.env.JWTSECRET
      }
    );
    const user = await this.prisma.user.findFirst({
      where: {
          id: payload.sub,
      },
    })
    if (!user)
      socket.disconnect
      const id = this.getroombyuser(user)
      this.server.to((id).toString()).emit("lalalalala", `user ${user.name} keydownArrowUp`)
    console.log (`user KeyDownArrowUp : ${user.name}`)
  }
}