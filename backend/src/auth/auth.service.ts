import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "./../users/users.services";
import { SignupDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';
import { ResponseDto } from "./dto/response.dto";
import { LoginDto } from "./dto/loginRequest.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ForgetPasswordDto } from "./dto/forgetPassword.dto";
import { NotFoundError } from "rxjs";


@Injectable()
export class AuthService{

    constructor(private readonly userService: UserService,private configService: ConfigService,private readonly jwtService: JwtService){}

    async createUser(signUpDto: SignupDto){

        const existing= await this.userService.findByUsername(signUpDto.userName);
        
        if(existing){
            throw new ConflictException("Username Already Exists");
        }

        // hashedPassword
        const hashedPassword=await bcrypt.hash(signUpDto.password,10);

        //create user by sending the modified password

        //send the user's data but first modify password.
        const user= await this.userService.createUser({...signUpDto,password: hashedPassword});
        
        //fetch all the data from the user and copy to variable finalData without the password
        

        // return new ResponseDto(user);
        return "User registered successfully"
    }

    async loginRequest(loginDto: LoginDto){

        //find by the username
        const user=await this.userService.findByUsername(loginDto.userName)
        //if doesnt exist then tell that the username is wrong or the user doesnt exist

        if(!user){
            throw new UnauthorizedException("Username is not correct.")
        }

        //compare password 
        const inputPassword=loginDto.password;

        const isPasswordCorrect=await bcrypt.compare(inputPassword,user.password);

        //if password doesnt matched return error
        if(!isPasswordCorrect){
            throw new UnauthorizedException("Password entered is incorrect");
        }

        //generate jwt token 
        const payload={ 
            userId: user.id,
            userName: user.userName,
            email: user.email
        }
        
        const accessToken=await this.jwtService.signAsync(payload);

        console.log(accessToken);

        //return jwt token
        return {accessToken}


    }

    async passwordReset(password: string, confirmPassword: string, email:string){

        if(password!== confirmPassword){
            throw new BadRequestException("Passwords do not match")
        }

        const emailConfirmed=await this.userService.findUserByEmail(email);

        if(!emailConfirmed){
            throw new NotFoundException("Cant find any user with the given mail")
        }

        //generate token
        //send the token to the mail 

        const hashedPassword=await bcrypt.hash(password,10);

        const user=this.userService.find



    }

}