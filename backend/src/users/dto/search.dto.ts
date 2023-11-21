import { IsInt, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SearchDto {
    @IsNotEmpty()
    @IsString()
    search: string;
}

export class upNameDto {
    @IsNotEmpty()
    @IsString()
	@MaxLength(100, {message: "The name must be between 1 and 15 characters."})
	@Matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]+$/, {message: "The name must only contain letters, digits and '-' or '_'. It must have at least a letter or a digit."})
    name: string;
}

export class addRelationDto {
    @IsInt()
    @IsNotEmpty()
    target_id: number;

    @IsNotEmpty()
    @IsString()
    status: string;
}

export class rmRelationDto {
    @IsInt()
    @IsNotEmpty()
    target_id: number;
}