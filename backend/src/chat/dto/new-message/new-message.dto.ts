import { IsNotEmpty, IsString } from "class-validator";

export class NewMessageDto {
	@IsString()
	@IsNotEmpty()
	msg: string;
}