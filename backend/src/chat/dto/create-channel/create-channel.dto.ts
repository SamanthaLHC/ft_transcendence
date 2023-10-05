import { Privacy } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Matches, Max, MaxLength } from "class-validator";

export class CreateChannelDto {
	@IsNotEmpty()
	@MaxLength(100)
	@IsString()
	@Matches(/^[A-Za-z0-9_-]*$/)
	name: string;

	@IsEnum(Privacy)
	privacy: Privacy;
}