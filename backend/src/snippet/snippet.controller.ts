import { Controller, Req, Post, Body, Param, Get, ParseIntPipe, Delete, UseGuards, Query } from "@nestjs/common";
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
import { log } from "console";
import { AllCountLanguages } from "./dto/allLanguages-Count";
import { AllSharedSnippets } from "./dto/allSharedSnippetDetails";



@Controller('snippet')
export class SnippetController {
    constructor(private readonly snippetService: SnippetService) { }

    @UseGuards(AuthGuard)
    @Get('allSnippet') async getAllSnippetsOfUsers(@Req() req: AuthRequest) {
        console.log("All snippet Route hit");

        return this.snippetService.getAllSnippetsOfUsers(req.user.userName);

    }
    //generate the recent snippets
    @UseGuards(AuthGuard)
    @Get('recent')
    async getRecentSnippets(@Req() req: AuthRequest): Promise<TopSnippet> {
        console.log("reaching recent")
        return this.snippetService.getRecentSnippets(req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Post()//creating new snippet
    async createSnippet(@Req() req: AuthRequest, @Body() snippetReqB: SnippetReqDTO) {
        console.log(req.user.userId);
        console.log(req.user.userName);

        return this.snippetService.createSnippet(snippetReqB, req.user.userName);
    }

    //all snippets by pages
    @UseGuards(AuthGuard)
    @Get('all')
    async getAllSnippets(
        @Req() req: AuthRequest,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.snippetService.getAllSnippets(page, limit, req.user.userName);

    }
    @UseGuards(AuthGuard)

    @Get('share/myShares')
    async getAllSharedSnippetsDetails(@Req() req: AuthRequest): Promise<AllSharedSnippets[]> {
        console.log("reached allSharedSNippets")
        return this.snippetService.getAllSharedSnippetsDetails(req.user.userId);
    }

    //search by title
    @UseGuards(AuthGuard)
    @Get('search/title/:title')
    async getByTitle(@Param('title') title: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        console.log("it has reached title");
        return this.snippetService.getByTitle(title, req.user.userId);
    }

    //make api which should return an array of language with each language count,rest return data of the searched snippet
    @UseGuards(AuthGuard)
    @Get('load/totalLanguage')
    async getTotalLanguage(@Req() req: AuthRequest): Promise<AllCountLanguages[]> {
        console.log("reaching tags count");
        return this.snippetService.getTotalLanguage(req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Get('search/language/:lang')
    async getByLanguage(@Param('lang') language: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        console.log("reaching language")
        return this.snippetService.getByLanguage(language, req.user.userId);

    }

    //get by language and title.
    @UseGuards(AuthGuard)
    @Get('search/:anyKeyword')
    async getByTitleOrLanguage(@Param('anyKeyword') anyKeyword: string, @Req() req: AuthRequest): Promise<SnippetResponseDTO[]> {
        return this.snippetService.getByAnykeyword(anyKeyword, req.user.userId)
    }

    @UseGuards(AuthGuard)
    //share any snippet
    @Get('share/:id')
    async generateTokenBySnippetId(@Param('id', ParseIntPipe) snippetId: number, @Req() req: AuthRequest): Promise<ShareTokenResDTO> {
        console.log("reached share by id");

        return this.snippetService.generateTokenBySnippetId(snippetId, req.user.userId);
    }

    @Get('getSnippet/:token')
    async getSharedSnippetByToken(@Param('token') token: string) {
        return this.snippetService.getSharedSnippetByToken(token);
    }

    //get versions of snippets by id.
    @UseGuards(AuthGuard)
    @Get('versions/:snippetId')
    async getSnippetsVersions(@Param('snippetId', ParseIntPipe) snippetId: number, @Req() req: AuthRequest): Promise<SnippetSumamryDTO[]> {
        console.log(" reached all versions by id")
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


    @UseGuards(AuthGuard)
    //share any snippetVersion by token
    @Post('token/:snippetId/:versionId')
    async generateTokenBySnippetVersionId(@Param('snippetId', ParseIntPipe) snippetId: number, @Param('versionId', ParseIntPipe) versionId: number, @Req() req: AuthRequest): Promise<ShareTokenResDTO> {
        return this.snippetService.generateTokenBySnippetVersionId(snippetId, versionId, req.user.userId);

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

    //delete snippet by id
    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async deleteSnippet(@Req() req: AuthRequest, @Param('id', ParseIntPipe) snippetID: number): Promise<string> {
        console.log("reached delete");
        
        return this.snippetService.deleteSnippet(req.user.userId, snippetID);
    }

    //delete snippetVersion
    @UseGuards(AuthGuard)
    @Delete('delete/:snippetId/version/:versionId')
    async deleteVersion(@Req() req: AuthRequest, @Param('snippetId', ParseIntPipe)snippetId: number,@Param('versionId', ParseIntPipe) versionId: number):Promise<string> {
        console.log("reached delete by snippetversion");
        return this.snippetService.deleteVersion(req.user.userId, snippetId,versionId)
        
    }






}