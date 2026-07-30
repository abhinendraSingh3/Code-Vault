import { Controller, Req,Post, Body, Param,Get, ParseIntPipe, Delete } from "@nestjs/common";
import { SnippetService } from "./snippet.service";
import { SnippetReqDTO } from "./dto/snippet-request";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { SnippetResponseDTO } from "./dto/snippet-response";
import { ShareTokenResDTO } from "./dto/share-token-response";


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
    async updateSnippet(@Req() req: AuthRequest, @Param('id',ParseIntPipe) snippetId: number, @Body() snippetData: SnippetReqDTO):Promise<SnippetResponseDTO>{
        return this.snippetService.updateSnippet(req.user.userName, snippetId, snippetData)
    }

    @Delete(':id')
    async deleteSnippet(@Req() req: AuthRequest, @Param('id', ParseIntPipe) snippetID: number): Promise <string>{
        return this.snippetService.deleteSnippet(req.user.userName, snippetID);
    }

    @Get('search/language/:lang')
    async getByLanguage(@Param('lang') language: string, @Req() req:AuthRequest): Promise<SnippetResponseDTO[]>{
        return this.snippetService.getByLanguage(language,req.user.userId);

    }

    @Get('search/title/:title')
    async getByTitle(@Param('title') title: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]>{
        return this.snippetService.getByTitle(title, req.user.userId);
    }

    @Get('search/:anyKeyword')
    async getByTitleOrLanguage(@Param('anyKeyword') anyKeyword: string,@Req() req: AuthRequest): Promise <SnippetResponseDTO[]>{
        return this.snippetService.getByAnykeyword(anyKeyword, req.user.userId)
    }
    
    //share any snippet
    @Get('token/:id')
    async generateTokenBySnippetId(@Param('id') snippetId: number,@Req() req: AuthRequest):Promise<ShareTokenResDTO>{
        return this.snippetService.generateTokenBySnippetId(snippetId, req.user.userId);

    }

    //share any snippetVersion variable
    @Get('token/:snippetid/:versionId')
    async generateTokenBySnippetVersionId(@Param('snippetId') snippetId: number,@Param('versionId') versionId: number, @Req() req: AuthRequest):Promise<ShareTokenResDTO>{
        return this.snippetService.generateTokenBySnippetVersionId(snippetId,versionId, req.user.userId);

    }

    @Get(':token')
    async getSharedSnippetByToken(@Param('token') token: string): Promise<SnippetResponseDTO>{
        return this.snippetService.getSharedSnippetByToken(token);
    }





}