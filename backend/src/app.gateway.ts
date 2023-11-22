import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "./prisma/prisma.service";

@WebSocketGateway({ cors: { origin: ['http://localhost:8000'] }, namespace: 'status' })
export class MasterGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService, private prisma: PrismaService) { }
  @WebSocketServer()
  server: Server

  async handleConnection(socket: Socket) {
    try {
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
      {
        socket.disconnect

      }
      else {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { status: "CONNECTED" },
        })
      }
    }
    catch (e) {
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const token = socket.handshake.auth.token;
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWTSECRET
        }
      );
      if (!payload || !payload.sub)
      {
        return
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: payload.sub,
        },
      })
      if (!user)
        socket.disconnect
      else {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { status: "DISCONNECTED" },
        })
      }
    }
    catch (e) {
    }
  }
}