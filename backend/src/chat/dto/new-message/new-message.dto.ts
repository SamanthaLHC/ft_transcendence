import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class NewMessageDto {
	@IsString()
	@IsNotEmpty()
	msg: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[A-Za-z0-9_-]*$/)
	channel: string;
}