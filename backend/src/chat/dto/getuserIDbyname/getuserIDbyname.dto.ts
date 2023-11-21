import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class getuserIDbyname {
	@IsNotEmpty()
	@IsNumber()
	ChannelId: number;

	@IsString()
	@IsNotEmpty()
	name: string;
}
