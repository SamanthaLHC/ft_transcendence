import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Data, Room } from './interface/gamef.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { GameFService } from './gamef.service';

@WebSocketGateway({ cors: { origin: ['http://' + process.env.REACT_APP_HOSTNAME + ':8000'] }, namespace: 'fgame' })
export class GameFGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService, private usersService: UsersService, private prisma: PrismaService, private gameFService: GameFService) { }
  @WebSocketServer()
  server: Server;
  rooms: Room[]


  roomisfull(id: number): boolean {
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
    if (rand < 5)
      dat.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
    else
      dat.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10
    const rande = Math.floor(Math.random() * (10 - 1 + 1) + 1)
    if (rande < 5)
      dat.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
    else
      dat.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10
    return dat
  }


  async handleConnection(socket: Socket) {
    console.log("connected")
  }

  @SubscribeMessage('conection')
  async messconnect(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
    const id_num: number = +id
    if (!id_num) {
      socket.disconnect
      return;
    }
    const token = socket.handshake.auth.token;
    const payload = await this.jwtService.verifyAsync(
      token,
      {
        secret: process.env.JWTSECRET
      }
    );
    if (payload.sub == id_num)
    {
      socket.emit("game_finish")
      return ;
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    })
    if (!user)
      socket.disconnect
    if (!this.rooms || this.rooms.length == 0) {
      this.rooms = []
      let data: Data
      data = this.init_data()
      data.jgaucheid = user.id
      data.jgscockid = socket.id
      this.rooms.push({ id: 0, userone: user, usertwo: null, data: data, waitingId: id_num })
      await this.server.in(socket.id).socketsJoin("friend_0")
      return
    }
    else {
      let i = this.rooms.length -1
      while (i >= 0) {
        if (this.roomisfull(i)) {
          i--
        }
        else if (+(this.rooms[i].waitingId) == user.id && this.rooms[i].userone.id == id_num) {
          this.rooms[i].usertwo = user
          this.rooms[i].data.jdroiteid = user.id
          this.rooms[i].data.jdscockid = socket.id
          await this.server.in(socket.id).socketsJoin("friend_" + (i).toString())
          this.gameFService.set_status("INGAME", user.id)
          this.gameFService.set_status("INGAME", this.rooms[i].data.jgaucheid)
          await new Promise(f => setTimeout(f, 2000));
          this.server.to("friend_" + (i).toString()).emit("connect_room", `${i}`)
          this.server.to("friend_" + (i).toString()).emit("update", this.rooms[i].data)
          this.startgame(i)
          return
        }
        else
          i--
      }
      if (i == -1) {
        i = this.rooms.length
        let data: Data
        data = this.init_data()
        data.jgaucheid = user.id
        data.jgscockid = socket.id
        this.rooms.push({ id: i, userone: user, usertwo: null, data: data, waitingId: id_num })
        await this.server.in(socket.id).socketsJoin("friend_" + (i).toString())
        return
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
    if (roomid != -1 && this.rooms[roomid].data) {
      if (!this.roomisfull(roomid) && this.rooms[roomid].data.jgscockid === socket.id) {
        this.rooms.pop()
      }
    }
    this.gameFService.set_status("CONNECTED", user.id)
  }

  getroombyuser(user: User): number {
    let i = this.rooms.length - 1;
    while (i >= 0) {
      if (this.rooms[i].userone.id == user.id)
        return i
      if (this.rooms[i].usertwo && this.rooms[i].usertwo.id == user.id)
        return i
      i--
    }
    return -1
  }

  resetgame(roomid: number) {
    const rand = Math.floor(Math.random() * (10 - 1 + 1) - 1)
    if (rand < 5)
      this.rooms[roomid].data.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10 * -1
    else
      this.rooms[roomid].data.speedballY = (Math.random() * (10 - 3 + 1) + 3) / 10
    this.rooms[roomid].data.posballex = 50
    this.rooms[roomid].data.posballey = 50
  }

  async startgame(roomid: number) {
    let finish = false
    this.server.to("friend_" + (roomid).toString()).emit("update", this.rooms[roomid].data)
    await new Promise(f => setTimeout(f, 3000));
    while (!finish) {
      this.rooms[roomid].data.posballex += this.rooms[roomid].data.speedballX
      this.rooms[roomid].data.posballey += this.rooms[roomid].data.speedballY
      if (this.rooms[roomid].data.posballex <= 0) {
        this.rooms[roomid].data.speedballX = (Math.random() * (10 - 3 + 1) + 3) / 10
        this.resetgame(roomid)
        this.rooms[roomid].data.scoredroite++
        this.server.to("friend_" + (roomid).toString()).emit("update", this.rooms[roomid].data)
        await new Promise(f => setTimeout(f, 3000));
      }
      if (this.rooms[roomid].data.posballex >= 100) {
        this.rooms[roomid].data.speedballX = ((Math.random() * (10 - 3 + 1) + 3) / 10) * -1
        this.resetgame(roomid)
        this.rooms[roomid].data.scoregauche++
        this.server.to("friend_" + (roomid).toString()).emit("update", this.rooms[roomid].data)
        await new Promise(f => setTimeout(f, 3000));
      }
			if (this.rooms[roomid].data.posballex >= 97 && this.rooms[roomid].data.posballex <= 100) {
				if ((this.rooms[roomid].data.jdroite * 10) <= this.rooms[roomid].data.posballey && (this.rooms[roomid].data.jdroite * 10) + 20 >= this.rooms[roomid].data.posballey) {
					let relativePosition = (this.rooms[roomid].data.posballey - (this.rooms[roomid].data.jdroite * 10)) / 10 - 1;
					let angle = relativePosition * Math.PI / 3;
					let originalSpeed = Math.sqrt(this.rooms[roomid].data.speedballX ** 2 + this.rooms[roomid].data.speedballY ** 2);
					this.rooms[roomid].data.speedballX = originalSpeed * Math.cos(angle);
					this.rooms[roomid].data.speedballY = originalSpeed * Math.sin(angle);
					this.rooms[roomid].data.speedballX = -this.rooms[roomid].data.speedballX
					this.rooms[roomid].data.posballex = 96
					if (this.rooms[roomid].data.speedballX > 0)
						this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX + 0.05
					else
						this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX - 0.05
					if (this.rooms[roomid].data.speedballY > 0)
						this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY + 0.05
					else
						this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY - 0.05
					this.server.to((roomid).toString()).emit("colpad")
				}
			}
			else if (this.rooms[roomid].data.posballex >= 0 && this.rooms[roomid].data.posballex <= 3) {
				if ((this.rooms[roomid].data.jgauche * 10) <= this.rooms[roomid].data.posballey && this.rooms[roomid].data.jgauche * 10 + 20 >= this.rooms[roomid].data.posballey) {
					let relativePosition = (this.rooms[roomid].data.posballey - (this.rooms[roomid].data.jgauche * 10)) / 10 - 1;
					let angle = relativePosition * Math.PI / 3;
					let originalSpeed = Math.sqrt(this.rooms[roomid].data.speedballX ** 2 + this.rooms[roomid].data.speedballY ** 2);
					this.rooms[roomid].data.speedballX = originalSpeed * Math.cos(angle);
					this.rooms[roomid].data.speedballY = originalSpeed * Math.sin(angle);
					if (this.rooms[roomid].data.speedballX > 0)
						this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX + 0.05
					else
						this.rooms[roomid].data.speedballX = this.rooms[roomid].data.speedballX - 0.05
					if (this.rooms[roomid].data.speedballY > 0)
						this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY + 0.05
					else
						this.rooms[roomid].data.speedballY = this.rooms[roomid].data.speedballY - 0.05
					this.rooms[roomid].data.posballex = 4
					this.server.to((roomid).toString()).emit("colpad")
				}
			}
      if (this.rooms[roomid].data.posballey <= 0 || this.rooms[roomid].data.posballey >= 100)
        this.rooms[roomid].data.speedballY = -this.rooms[roomid].data.speedballY
      this.server.to("friend_" + (roomid).toString()).emit("update", this.rooms[roomid].data)
      if (this.rooms[roomid].data.scoredroite > 4 || this.rooms[roomid].data.scoregauche > 4)
        finish = true
      await new Promise(f => setTimeout(f, 33));
    }
    this.gameFService.finish_game(this.rooms[roomid].data)
    this.server.to("friend_" + (roomid).toString()).emit("aff_win", this.rooms[roomid].data)
    await new Promise(f => setTimeout(f, 5000));
    this.server.to("friend_" + (roomid).toString()).emit("game_finish")
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
    if (id == -1)
      return
    if (socket.id == this.rooms[id].data.jdscockid) {
      if (this.rooms[id].data.jdroite < 8)
        this.rooms[id].data.jdroite = this.rooms[id].data.jdroite + 1
    }
    else if ((socket.id == this.rooms[id].data.jgscockid)) {
      if (this.rooms[id].data.jgauche < 8)
        this.rooms[id].data.jgauche = this.rooms[id].data.jgauche + 1
    }
    this.server.to("friend_" + (id).toString()).emit("update", this.rooms[id].data)
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
    if (id == -1)
      return
    if (socket.id == this.rooms[id].data.jdscockid) {
      if (this.rooms[id].data.jdroite > 0)
        this.rooms[id].data.jdroite = this.rooms[id].data.jdroite - 1
    }
    else if ((socket.id == this.rooms[id].data.jgscockid)) {
      if (this.rooms[id].data.jgauche > 0)
        this.rooms[id].data.jgauche = this.rooms[id].data.jgauche - 1
    }
    this.server.to("friend_" + (id).toString()).emit("update", this.rooms[id].data)
  }
}