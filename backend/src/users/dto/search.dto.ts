import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SearchDto {
    @IsNotEmpty()
    @IsString()
    search: string;
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