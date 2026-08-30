import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

    //inserting entity as a service coz we want the entity to talk to database
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async findByUsername(userName: string) {
        return await this.userRepo.findOne({
            where: {
                userName: userName
            }
        });
    }

    async createUser(userData: Partial<User>): Promise<User> {
        const newUser = this.userRepo.create(userData)
        return this.userRepo.save(newUser);
    }

    async findByUserId(userId: number) {
        return await this.userRepo.findOne({
            where: {
                id: userId
            }
        });
    }

    async findUserByEmail(email:string){
        return await this.userRepo.findOne({
            where:{
                email:email
            }
        })
    }

    async updateUserProfile(userId: number, updateData: Partial<User>) {
        await this.userRepo.update(userId, updateData);
        return await this.findByUserId(userId);
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await this.findByUserId(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException("Current password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update(userId, { password: hashedPassword });
        return { message: "Password updated successfully" };
    }
}