import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatSocketDto } from './dto/chat_socket.dto';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }, namespace: "chat"})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	sockets: [ChatSocketDto];

	@WebSocketServer()
	server: Server

	handleConnection(socket: Socket) {
		let newSocket = new ChatSocketDto() 
		newSocket.socket = socket
		newSocket.room = ""
		newSocket.user = ""
		if (this.sockets === undefined) {
			this.sockets = [newSocket]
		} else {
			this.sockets.push(newSocket)
		}
		let findSocket = this.sockets.find(sockets => sockets.socket === socket)
		let pos = this.sockets.indexOf(findSocket);
		console.log("hello chat ")
	}
	
	handleDisconnect(@ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		let pos = this.sockets.indexOf(findSocket);
		let removedItem = this.sockets.splice(pos, 1);
		console.log("User " + removedItem["user"] + " was disconnected from " + removedItem["socket"])
	}

	@SubscribeMessage('change_room')
	changeRoom(@MessageBody() new_room: string, @ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			findSocket.socket.leave(findSocket.room)
		}
		findSocket.socket.join(new_room)
		console.log("Joining " + new_room)
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


	@SubscribeMessage('update')
	broadCast(@MessageBody() event: string, @ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			this.server.to(findSocket.room).emit("update_front", findSocket.room)
		}
	}
}
