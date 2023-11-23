import { IsString, Matches, IsEnum, MinLength, ValidateIf } from "class-validator";
import { Privacy } from "@prisma/client";

export class editChannelDto {
	@IsEnum(Privacy)
	privacy: Privacy;

	@MinLength(8)
	@IsString()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/, 
		{message: "Password must contain at least an uppercase letter, a lowercase letter, a digit and a special character among '!@#$%^&*'"})
	@ValidateIf(o => o.privacy === 'PASSWORD_PROTECTED')
	password?: string;
}