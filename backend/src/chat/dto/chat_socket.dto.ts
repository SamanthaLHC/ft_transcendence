import { Socket } from 'socket.io';

export class ChatSocketDto {
	socket: Socket
	room: string;
	user: string
}