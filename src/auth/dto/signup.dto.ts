import { Injectable } from "@nestjs/common";
import { IsEmail, IsEmpty, IsNotEmpty, IsPassportNumber, IsString, IsStrongPassword } from "class-validator";

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

    @IsStrongPassword(
    {minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1}
    )
    @IsNotEmpty()
    password!: string;

}