import { Optional } from "@nestjs/common";
import { Privacy } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateIf } from "class-validator";

export class CreateChannelDto {
	@IsNotEmpty()
	@MaxLength(100)
	@IsString()
	@Matches(/^[A-Za-z0-9_-]*$/)
	name: string;

	@IsEnum(Privacy)
	privacy: Privacy;


	@ValidateIf(o => o.privacy === 'PASSWORD_PROTECTED')
	@IsString()
	password?: string;
}