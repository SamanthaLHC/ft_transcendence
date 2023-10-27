import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewMessageDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(2000)
	msg: string;
}