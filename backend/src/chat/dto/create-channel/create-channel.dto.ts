import { Privacy } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class CreateChannelDto {
	@IsNotEmpty()
	@MaxLength(100)
	@IsString()
	@Matches(/^[A-Za-z0-9_-]*$/)
	name: string;

	@IsEnum(Privacy)
	privacy: Privacy;
}