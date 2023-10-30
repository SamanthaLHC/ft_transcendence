import { Privacy } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";

export class JoinChannelPasswordDTO {
	@IsEnum(Privacy)
	privacy: Privacy;

	@IsString()
	@ValidateIf(o => o.privacy === 'PASSWORD_PROTECTED')
	password?: string;
}
export class CreateChannelDto {
	@IsNotEmpty()
	@MaxLength(100)
	@IsString()
	@Matches(/^[A-Za-z0-9_-]*$/)
	name: string;

	@IsEnum(Privacy)
	privacy: Privacy;

	@MinLength(8)
	@IsString()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, 
		{message: "Password must contain at least an uppercase letter, a lowercase letter, a digit and a special character among '!@#$%^&*'"})
	@ValidateIf(o => o.privacy === 'PASSWORD_PROTECTED')
	password?: string;
}
