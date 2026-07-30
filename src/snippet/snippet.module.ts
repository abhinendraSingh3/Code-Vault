import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { SnippetController } from "./snippet.controller";
import { SnippetService } from "./snippet.service";
import { UsersModule } from "../users/users.module";
import { ShareToken } from "./entities/snippet-shareToken";
import { SnippetVersions } from "./entities/snippet-versions-entities";

@Module({
    imports:[TypeOrmModule.forFeature([Snippet,ShareToken,SnippetVersions]),UsersModule,],
    controllers:[SnippetController],
    providers:[SnippetService],
    exports:[SnippetService]
})

export class SnippetModule{}