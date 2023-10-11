import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Data, Room } from './interface/game.interface';
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

  init_data(): Data {
    let dat: Data = {jgauche: 5,
      jdroite: 5,
      posballex: 50,
      posballey: 50, jgaucheid: null, jdroiteid: null}
    
    return dat
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
      let data: Data
      data = this.init_data()
      data.jgaucheid = user.id
      console.log(data)
      this.rooms.push({id: 0, userone: user, usertwo: null, data: data})
      await this.server.in(socket.id).socketsJoin("0")
    }
    else {
      if (this.roomisfull(this.rooms.length - 1))
      {
        let data: Data
        data = this.init_data()
        data.jgaucheid = user.id
        console.log(data)
        this.rooms.push({id: this.rooms.length, userone: user, usertwo: null, data: data})
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
      }
      else {
        this.rooms[this.rooms.length - 1].usertwo = user
        this.rooms[this.rooms.length - 1].data.jdroiteid = user.id
        console.log(this.rooms[this.rooms.length - 1].data)
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
        this.server.to((this.rooms.length - 1).toString()).emit("connect_room", `${this.rooms.length - 1}`)
        this.server.to((this.rooms.length - 1).toString()).emit("update", this.rooms[this.rooms.length - 1].data)
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
    console.log("on down")
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
    if (user.id == this.rooms[id].data.jdroiteid)
    {
      if (this.rooms[id].data.jdroite > 1)
        this.rooms[id].data.jdroite = this.rooms[id].data.jdroite - 1
    }
    else if ((user.id == this.rooms[id].data.jgaucheid))
    {
      if (this.rooms[id].data.jgauche > 1)
        this.rooms[id].data.jgauche = this.rooms[id].data.jgauche - 1
    }
    else
      console.log("error")
    this.server.to((id).toString()).emit("update", this.rooms[id].data)
  }

  @SubscribeMessage('OnKeyDownArrowUp')
  async handleMessage_up(@ConnectedSocket() socket: Socket) {
    console.log("on up")
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
      if (user.id == this.rooms[id].data.jdroiteid)
      {
        if (this.rooms[id].data.jdroite < 10)
          this.rooms[id].data.jdroite = this.rooms[id].data.jdroite + 1
      }
      else if ((user.id == this.rooms[id].data.jgaucheid))
      {
        if (this.rooms[id].data.jgauche < 10)
          this.rooms[id].data.jgauche = this.rooms[id].data.jgauche + 1
      }
      else
        console.log("error")
      this.server.to((id).toString()).emit("update", this.rooms[id].data)
  }
}