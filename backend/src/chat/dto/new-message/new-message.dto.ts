import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class NewMessageDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(5000)
	msg: string;
}