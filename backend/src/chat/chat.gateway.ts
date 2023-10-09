import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: { origin:['http://localhost:8000'] }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server

	handleConnection(socket: Socket) {
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
}
