import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignupDto{

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsNotEmpty()
    @IsString()
    firstName!: string;
    
    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    password!: string;

    @IsOptional()
    @IsString()
    profilePic?: string;

    @IsOptional()
    @IsString()
    bio?: string;
}