import { IsNotEmpty, IsNumber } from "class-validator";


export class MuteDto {
	@IsNotEmpty()
	targetName: string;

	@IsNotEmpty()
	@IsNumber()
	time: string;
}
