import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Data, Room } from './interface/game.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { GameService } from './game.service';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService, private usersService: UsersService, private prisma: PrismaService, private gameService: GameService) {}
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
    let dat: Data = {
      jgauche: 5,
      jdroite: 5,
      posballex: 50,
      posballey: 50,
      jgaucheid: null,
      jdroiteid: null,
      jdscockid: null,
      jgscockid: null,
      scoredroite: 0,
      scoregauche: 0,
      speedballX: 0,
      speedballY: 0
    }
      const rand = Math.floor(Math.random() * (10 - 1 + 1) + 1)
      if (rand < 5 )
        dat.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
      else
        dat.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10
      const rande = Math.floor(Math.random() * (10 - 1 + 1) + 1)
      if (rande < 5 )
        dat.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
      else
        dat.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10
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
    if(!this.rooms || this.rooms.length == 0)
    {
      this.rooms = []
      let data: Data
      data = this.init_data()
      data.jgaucheid = user.id
      data.jgscockid = socket.id
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
        data.jgscockid = socket.id
        console.log(data)
        this.rooms.push({id: this.rooms.length, userone: user, usertwo: null, data: data})
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
      }
      else {
        this.rooms[this.rooms.length - 1].usertwo = user
        this.rooms[this.rooms.length - 1].data.jdroiteid = user.id
        this.rooms[this.rooms.length - 1].data.jdscockid = socket.id
        console.log(this.rooms[this.rooms.length - 1].data)
        await this.server.in(socket.id).socketsJoin((this.rooms.length - 1).toString())
        this.server.to((this.rooms.length - 1).toString()).emit("connect_room", `${this.rooms.length - 1}`)
        this.server.to((this.rooms.length - 1).toString()).emit("update", this.rooms[this.rooms.length - 1].data)
        console.log("starting game on room ", this.rooms.length - 1)
        this.startgame(this.rooms.length - 1)
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
    const user = await this.prisma.user.findFirst({
      where: {
          id: payload.sub,
      },
    })
    const roomid = this.getroombyuser(user)
    if (!this.roomisfull(roomid))
    {
      this.rooms.pop()
    }
    console.log (`user disconnect : ${user.name}`)
  }

  getroombyuser(user: User): number
  {
    let i = this.rooms.length -1;
    while (this.rooms[i])
    {
      if (this.rooms[i].userone.id === user.id || this.rooms[i].usertwo.id === user.id)
        return i
      i++
    }
    return -1
  }

  resetgame(roomid: number) {
    const rand = Math.floor(Math.random() * (10 - 1 + 1) - 1)
    if (rand < 5 )
      this.rooms[roomid].data.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
    else
      this.rooms[roomid].data.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10
    console.log("speed balle ", this.rooms[roomid].data.speedballY)
    this.rooms[roomid].data.posballex = 50
    this.rooms[roomid].data.posballey = 50
  }

  async startgame(roomid:number)
  {
    let finish = false
    while(!finish)
    {
      this.rooms[roomid].data.posballex += this.rooms[roomid].data.speedballX
      this.rooms[roomid].data.posballey += this.rooms[roomid].data.speedballY
      if (this.rooms[roomid].data.posballex <= 0)
      {
        this.rooms[roomid].data.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10
        this.resetgame(roomid)
        this.rooms[roomid].data.scoredroite++
        console.log("score gauche ", this.rooms[roomid].data.scoregauche)
        this.server.to((roomid).toString()).emit("update", this.rooms[roomid].data)
        await new Promise(f => setTimeout(f, 3000));
      }
      if (this.rooms[roomid].data.posballex >= 100)
      {
        this.rooms[roomid].data.speedballX = ((Math.random() * (10 - 3 + 1) + 3) / 10) * -1
        this.resetgame(roomid)
        this.rooms[roomid].data.scoregauche++
        console.log("score droite ", this.rooms[roomid].data.scoredroite)
        this.server.to((roomid).toString()).emit("update", this.rooms[roomid].data)
        await new Promise(f => setTimeout(f, 3000));
      }
      if (this.rooms[roomid].data.posballex >= 97 && this.rooms[roomid].data.posballex <= 100)
      {
        console.log("")
        console.log("jdroite", (this.rooms[roomid].data.jdroite * 10))
        console.log("jdroite", (this.rooms[roomid].data.jdroite * 10) + 20)
        console.log("jdroite", this.rooms[roomid].data.posballey)
        if ((this.rooms[roomid].data.jdroite * 10) <= this.rooms[roomid].data.posballey && (this.rooms[roomid].data.jdroite * 10) + 20 >= this.rooms[roomid].data.posballey)
        {
          this.rooms[roomid].data.speedballX = -this.rooms[roomid].data.speedballX
          if (this.rooms[roomid].data.speedballX > 0)
            this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX +0.05
          else
            this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX -0.05
          if (this.rooms[roomid].data.speedballY > 0)
            this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY +0.05
          else
            this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY -0.05
          this.server.to((roomid).toString()).emit("colpad")
          console.log("colision pad droite")
        }
      }
      else if (this.rooms[roomid].data.posballex >= 0 && this.rooms[roomid].data.posballex <= 3)
      {
        if ((this.rooms[roomid].data.jgauche * 10) <= this.rooms[roomid].data.posballey && this.rooms[roomid].data.jgauche * 10 + 20 >= this.rooms[roomid].data.posballey)
        {
          this.rooms[roomid].data.speedballX = -this.rooms[roomid].data.speedballX
          if (this.rooms[roomid].data.speedballX > 0)
            this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX +0.05
          else
            this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX -0.05
          if (this.rooms[roomid].data.speedballY > 0)
            this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY +0.05
          else
            this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY -0.05
          this.server.to((roomid).toString()).emit("colpad")
          console.log("colision pad gauche")
        }
      }
      if (this.rooms[roomid].data.posballey <= 0 || this.rooms[roomid].data.posballey >= 100)
        this.rooms[roomid].data.speedballY = -this.rooms[roomid].data.speedballY
      this.server.to((roomid).toString()).emit("update", this.rooms[roomid].data)
      if (this.rooms[roomid].data.scoredroite > 4 || this.rooms[roomid].data.scoregauche > 4)
        finish = true
      await new Promise(f => setTimeout(f, 33));
    }
    console.log("finish game in room ", roomid)
    this.gameService.finish_game(this.rooms[roomid].data)
    this.server.to((roomid).toString()).emit("aff_win", this.rooms[roomid].data)
    await new Promise(f => setTimeout(f, 5000));
    this.server.to((roomid).toString()).emit("game_finish")
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
    if (socket.id == this.rooms[id].data.jdscockid)
    {
      if (this.rooms[id].data.jdroite < 8)
        this.rooms[id].data.jdroite = this.rooms[id].data.jdroite + 1
    }
    else if ((socket.id == this.rooms[id].data.jgscockid))
    {
      if (this.rooms[id].data.jgauche < 8)
        this.rooms[id].data.jgauche = this.rooms[id].data.jgauche + 1
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
      if (socket.id == this.rooms[id].data.jdscockid)
      {
        if (this.rooms[id].data.jdroite > 0)
          this.rooms[id].data.jdroite = this.rooms[id].data.jdroite - 1
      }
      else if ((socket.id == this.rooms[id].data.jgscockid))
      {
        if (this.rooms[id].data.jgauche > 0)
          this.rooms[id].data.jgauche = this.rooms[id].data.jgauche - 1
      }
      else
        console.log("error")
      this.server.to((id).toString()).emit("update", this.rooms[id].data)
  }
}