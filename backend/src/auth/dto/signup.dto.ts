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

    
    
    @IsNotEmpty()
    password!: string;

}