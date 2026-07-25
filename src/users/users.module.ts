import { Controller, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./users.controller";
import { UserService } from "./users.services";

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports:[UserService]

})

export class UsersModule{}