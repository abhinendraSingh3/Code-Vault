import { Controller, Req,Post, Body, Param,Get, ParseIntPipe } from "@nestjs/common";
import { SnippetService } from "./snippet.service";
import { SnippetReqDTO } from "./dto/snippet-request";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { SnippetResponseDTO } from "./dto/snippet-response";


@Controller('snippet')
export class SnippetController{
    constructor(private readonly snippetService: SnippetService){}

    @Post()//creating new snippet
    async createSnippet(@Req() req: AuthRequest, @Body() snippetReqB: SnippetReqDTO){
        console.log(req.user.userId);
        console.log(req.user.userName);

        return this.snippetService.createSnippet(snippetReqB,req.user.userName);
    }

    @Get(':id')
    async getSnippetById(@Req() req: AuthRequest ,@Param('id') snippetId: number){
        return this.snippetService.getSnippetById(snippetId,req.user.userName);

    }

    @Get('all')
    async getAllSnippets(@Req() req: AuthRequest){
        return this.snippetService.getAllSnippets(req.user.userName);

    }
    @Post(':id')
    async updateSnippet(@Req() req: AuthRequest, @Param('id',ParseIntPipe) snippetId: number):Promise<SnippetResponseDTO>{
        return this.snippetService.updateSnippet(req.user.userName, snippetId)
    }
}