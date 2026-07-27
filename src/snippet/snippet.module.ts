import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { SnippetController } from "./snippet.controller";
import { SnippetService } from "./snippet.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports:[TypeOrmModule.forFeature([Snippet]),UsersModule],
    controllers:[SnippetController],
    providers:[SnippetService],
    exports:[SnippetService]
})

export class SnippetModule{}