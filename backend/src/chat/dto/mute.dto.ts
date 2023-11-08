import { IsNotEmpty, Matches } from "class-validator";


export class MuteDto {
	@IsNotEmpty()
	targetName: string;

	@IsNotEmpty()
	@Matches(/^[0-9]*$/)
	time: string;
}
