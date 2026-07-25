import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @IsString()
    @IsNotEmpty()
    userName!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

}