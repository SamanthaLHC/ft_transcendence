import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class UpdateChannelDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	@Matches(/^[A-Za-z0-9_-]*$/)
	channel: string;
}