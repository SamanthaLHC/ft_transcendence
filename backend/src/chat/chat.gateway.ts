import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	room: string
	socket: Socket;

	@WebSocketServer()
	server: Server

	handleConnection(socket: Socket) {
		this.socket = socket
		console.log("coucou chat")
		socket.emit('lalalalala', "coucou")
	}
	
	handleDisconnect(client: any) {
	
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
	// Handle received message
	console.log(data);
	this.server.emit('lalalalala', data); // Broadcast the message to all connected clients
	}

	changeRoom(new_room: string) {
		if (this.room) {
			this.socket.leave(this.room)
			console.log ("Change from ", this.room, " to ", new_room)
		}
		this.socket.join(new_room)
		this.room = new_room
	}

	getRoom() {
		return this.room;
	}

}
