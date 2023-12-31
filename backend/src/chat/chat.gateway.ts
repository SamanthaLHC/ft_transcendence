import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatSocketDto } from './dto/chat_socket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private jwtService: JwtService, private prisma: PrismaService) { }
	sockets: [ChatSocketDto];

	@WebSocketServer()
	server: Server

	async handleConnection(socket: Socket) {
		const token = socket.handshake.auth.token;
		let newSocket = new ChatSocketDto()
		newSocket.socket = socket
		newSocket.room = ""
		try {
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
			// if (!user)
			// 	socket.disconnect // ecrire disconnect() plutot que discnnect ? 
			// newSocket.user = (user.id).toString()
			if (user)
				newSocket.user = (user.id).toString()
		}
		catch (e) {
		}
		if (this.sockets === undefined) {
			this.sockets = [newSocket]
		} else {
			this.sockets.push(newSocket)
		}
		let findSocket = this.sockets.find(sockets => sockets.socket === socket)
		let pos = this.sockets.indexOf(findSocket);
	}

	async handleDisconnect(@ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		let userId = findSocket.user
		if (!userId)
			return
		await this.prisma.messages.updateMany({
			where:{
				senderId: +userId,
				type: "GAME"
			},
			data:{
				type: "MESSAGE",
				content: "[INVITATION JEU] - La personne a quite le chat"
			}
		})
		if (findSocket.room !== "") {
			this.server.to(findSocket.room).emit("update_front", findSocket.room)
		}
		let pos = this.sockets.indexOf(findSocket);
		let removedItem = this.sockets.splice(pos, 1);
	}

	@SubscribeMessage('change_room')
	changeRoom(@MessageBody() new_room: string, @ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			findSocket.socket.leave(findSocket.room)
		}
		findSocket.socket.join(new_room)
		findSocket.room = new_room
		client.emit("update_front")
	}

	@SubscribeMessage('get_channel')
	getRoom(@ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			this.server.to(findSocket.room).emit("channel", findSocket.room)
		}
	}

	@SubscribeMessage('update_otherchan')
	async updateotherchan(@MessageBody() messid: number, @ConnectedSocket() client: Socket) {
		const chan = await this.prisma.channels.findFirst({
			where: {
				id: messid
			}
		})
		let findSocket = this.sockets.find(sockets => sockets.room === chan.name)
		if (findSocket.room !== "") {
			this.server.to(findSocket.room).emit("update_front", findSocket.room)
		}
	}

	@SubscribeMessage('accepterinvgame')
	async acceptergame(@MessageBody() messid: string, @ConnectedSocket() client: Socket) {
		const message = await this.prisma.messages.findFirst({
			where: {
				id: +messid
			}
		}) 
		let findSocket = this.sockets.find(sockets => sockets.user === (message.senderId).toString())
		let clientSoc = this.sockets.find(sockets => sockets.socket === client)
		findSocket.socket.emit("accgame", clientSoc.user)
	}

	@SubscribeMessage('update')
	broadCast(@MessageBody() event: string, @ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			this.server.to(findSocket.room).emit("update_front", findSocket.room)
		}
	}
}
