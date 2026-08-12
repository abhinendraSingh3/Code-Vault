import { Controller, Req, Post, Body, Param, Get, ParseIntPipe, Delete, UseGuards, Query} from "@nestjs/common";
import { SnippetService } from "./snippet.service";
import { SnippetReqDTO } from "./dto/snippet-request";
import type { AuthRequest } from "../auth/interfaces/auth-request.interface";
import { SnippetResponseDTO } from "./dto/snippet-response";
import { ShareTokenResDTO } from "./dto/share-token-response";
import { SnippetSumamryDTO } from "./dto/snippet-summary";
import { AuthGuard } from "../auth/jwt.auth.guard";
import { AuthService } from "../auth/auth.service";
import { TopSnippet } from "./dto/topSnippetWithSnippetCountDto";
import { link } from "fs";



@Controller('snippet')
export class SnippetController {
    constructor(private readonly snippetService: SnippetService) { }

    //generate the recent snippets
    @UseGuards(AuthGuard)
    @Get('recent')
   async getRecentSnippets(@Req() req: AuthRequest): Promise <TopSnippet>{
    console.log("Its here man ",req.user.userId)
        return this.snippetService.getRecentSnippets(req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Post()//creating new snippet
    async createSnippet(@Req() req: AuthRequest, @Body() snippetReqB: SnippetReqDTO) {
        console.log(req.user.userId);
        console.log(req.user.userName);

        return this.snippetService.createSnippet(snippetReqB, req.user.userName);
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAllSnippets(
        @Req() req: AuthRequest,
        @Query('page') page:number,
        @Query('limit') limit:number,
    ) {
        return this.snippetService.getAllSnippets(page,limit,req.user.userName);

    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async getSnippetById(@Req() req: AuthRequest, @Param('id') snippetId: number) {
        return this.snippetService.getSnippetById(snippetId, req.user.userName);

    }

    @UseGuards(AuthGuard)
    @Post(':id')
    async updateSnippet(@Req() req: AuthRequest, @Param('id', ParseIntPipe) snippetId: number, @Body() snippetData: SnippetReqDTO): Promise<SnippetResponseDTO> {
        return this.snippetService.updateSnippet(req.user.userName, snippetId, snippetData)
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteSnippet(@Req() req: AuthRequest, @Param('id', ParseIntPipe) snippetID: number): Promise<string> {
        return this.snippetService.deleteSnippet(req.user.userName, snippetID);
    }

    @UseGuards(AuthGuard)
    @Get('search/language/:lang')
    async getByLanguage(@Param('lang') language: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        return this.snippetService.getByLanguage(language, req.user.userId);

    }

    @UseGuards(AuthGuard)
    @Get('search/title/:title')
    async getByTitle(@Param('title') title: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        return this.snippetService.getByTitle(title, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Get('search/:anyKeyword')
    async getByTitleOrLanguage(@Param('anyKeyword') anyKeyword: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        return this.snippetService.getByAnykeyword(anyKeyword, req.user.userId)
    }

    @UseGuards(AuthGuard)
    //share any snippet
    @Post('share/:id')
    async generateTokenBySnippetId(@Param('id',ParseIntPipe) snippetId: number, @Req() req: AuthRequest): Promise<ShareTokenResDTO> {
        return this.snippetService.generateTokenBySnippetId(snippetId, req.user.userId);

    }

    @UseGuards(AuthGuard)
    //share any snippetVersion by token
    @Post('token/:snippetId/:versionId')
    async generateTokenBySnippetVersionId(@Param('snippetId',ParseIntPipe) snippetId: number, @Param('versionId', ParseIntPipe) versionId: number, @Req() req: AuthRequest): Promise<ShareTokenResDTO> {
        return this.snippetService.generateTokenBySnippetVersionId(snippetId, versionId, req.user.userId);

    }

    @Get('getSnippet/:token')
    async getSharedSnippetByToken(@Param('token') token: string) {
        return this.snippetService.getSharedSnippetByToken(token);
    }

    @UseGuards(AuthGuard)
    @Get('versions/:snippetId')
    async getSnippetsVersions(@Param('snippetId', ParseIntPipe) snippetId: number, @Req() req: AuthRequest): Promise<SnippetSumamryDTO[]> {
        return this.snippetService.getSnippetsVersions(snippetId, req.user.userId)
    }

    //get snippet by snippetId, snippetVersionNumber
    @UseGuards(AuthGuard)
    @Get(':id/version/:versionNumber')
    getSnippetByIdAndVersionNumber(
        @Param('id', ParseIntPipe) snippetId: number,
        @Param('versionNumber', ParseIntPipe) versionNumber: number,
        @Req() req: AuthRequest
    ) {
        return this.snippetService.getSnippetByIdAndVersionNumber(
            snippetId,
            versionNumber,
            req.user.userId
        );
    }


}