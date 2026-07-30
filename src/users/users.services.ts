import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService{

    //inserting entity as a service coz we want the entity to talk to database
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async findByUsername(userName: string){
        return await this.userRepo.findOneBy({userName});
    }

    async createUser(userData: Partial<User>):Promise<User> {
        const newUser=this.userRepo.create(userData)
        return this.userRepo.save(newUser);
    }
    async findByUserId(userId:number){
        return await this.userRepo.findOne({
            where:{
                id:userId
            }
        });
    }


}