import { IsNotEmpty, IsNumber} from "class-validator";

export class CreateMpDTO {
	@IsNumber()
	@IsNotEmpty()
	targetId: number;
}