import { Body, Controller, ValidationPipe , Post, Request, Get, UseGuards} from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/loginRequest.dto";
import { AuthGuard } from "./jwt.auth.guard";

@Controller('auth')
export class AuthController{
    
    constructor(private readonly authService: AuthService ){} //DI

    @Post('signup')
    createUser(@Body(new ValidationPipe()) signUpDto: SignupDto){
        return this.authService.createUser(signUpDto);
    }

    @Post('login')
    loginUser(@Body(new ValidationPipe()) loginDto: LoginDto){
        return this.authService.loginRequest(loginDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req){
        return req.userId;
    }


    

}