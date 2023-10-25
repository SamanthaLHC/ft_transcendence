import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from "class-validator";

export class NewMessageDto {
	@IsString()
	@IsNotEmpty()
	msg: string;
}