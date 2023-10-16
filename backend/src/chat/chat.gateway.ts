import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatSocketDto } from './dto/chat_socket.dto';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }})
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
		console.log("coucou chat " + pos)
		socket.emit('lalalalala', "coucou")
	}
	
	handleDisconnect(@ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		let pos = this.sockets.indexOf(findSocket);
		let removedItem = this.sockets.splice(pos, 1);
		console.log("User " + removedItem["user"] + " was disconnected from " + removedItem["socket"])
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// Handle received message
	console.log(data);
	this.server.emit('lalalalala', data); // Broadcast the message to all connected clients
	}

	@SubscribeMessage('change_room')
	changeRoom(@MessageBody() new_room: string, @ConnectedSocket() client: Socket) {
		let findSocket = this.sockets.find(sockets => sockets.socket === client)
		if (findSocket.room !== "") {
			findSocket.socket.leave(findSocket.room)
			console.log ("Change from ", findSocket.room, " to ", new_room)
		}
		findSocket.socket.join(new_room)
		console.log("Joining " + new_room)
		console.log("Before change " + findSocket.room)
		findSocket.room = new_room
		let findSocket2 = this.sockets.find(sockets => sockets.socket === client)
		console.log("After change " + findSocket2.room)
	}
	
	// broadCast(event: string) {
	// 	console.log("Emiting to " + this.room)
	// 	this.server.to(this.room).emit("update", this.room + event)
	// }
}
