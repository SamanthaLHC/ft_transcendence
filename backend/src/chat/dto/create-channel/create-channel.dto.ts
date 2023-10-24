import { Optional, Type } from "@nestjs/common";
import { Privacy } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class ChannelPasswordDTO {
	@MinLength(8)
	@IsString()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, {message: "Password must contain at least an uppercase letter, a lowercase letter, a digit and a special character among '!@#$%^&*'"})
	password?: string;
}

export class CreateChannelDto extends ChannelPasswordDTO {
	@IsNotEmpty()
	@MaxLength(100)
	@IsString()
	@Matches(/^[A-Za-z0-9_-]*$/)
	name: string;

	@IsEnum(Privacy)
	privacy: Privacy;

	@ValidateIf(o => o.privacy === 'PASSWORD_PROTECTED')
	password?: string;
}
