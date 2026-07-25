import { Controller } from "@nestjs/common";
import { UserService } from "./users.services";

@Controller('users')
export class UserController{

    constructor(private readonly userService: UserService){} //DI
    
    

}