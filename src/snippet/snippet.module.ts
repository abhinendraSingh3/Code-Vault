import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { SnippetController } from "./snippet.controller";
import { SnippetService } from "./snippet.service";

@Module({
    imports:[TypeOrmModule.forFeature([Snippet])],
    controllers:[SnippetController],
    providers:[SnippetService],
    exports:[SnippetService]
})

export class SnippetModule{}