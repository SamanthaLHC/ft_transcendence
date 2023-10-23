import { Socket, Server } from 'socket.io';

export class ChatSocketDto {
	socket: Socket
	room: string;
	user: string
}