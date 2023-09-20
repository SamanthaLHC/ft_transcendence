import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class Auth2faDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsInt()
    id: number
}