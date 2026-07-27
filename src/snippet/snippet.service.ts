import { Controller, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SnippetReqDTO } from "./dto/snippet-request";
import { UserService } from "../users/users.services";
import { InjectRepository } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { Repository } from "typeorm";
import { SnippetResponseDTO } from "./dto/snippet-response";
import { promises } from "dns";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { User } from "../users/entities/user.entity";
import { SnippetVersions } from "./entities/snippet-versions-entities";

@Injectable()
export class SnippetService {

    constructor(

        @InjectRepository(Snippet)
        private readonly snippetRepo: Repository<Snippet>,

        @InjectRepository(SnippetVersions)
        private readonly snippetVersionRepo: Repository<SnippetVersions>,

        private readonly userService: UserService) { }


    //-------------- create Snippet --------------------
    async createSnippet(reqBody: SnippetReqDTO, userName: string) {

        const foundUser = await this.userService.findByUsername(userName);

        if (!foundUser) {
            throw new UnauthorizedException("User not found with the given username");
        }

        const snippetCreated = this.snippetRepo.create({
            ...reqBody,
            user: foundUser,
        })
        return this.snippetRepo.save(snippetCreated);
    }

    //-------------get snippet by ID-------------------
    async getSnippetById(snippetId: number, userName: string): Promise<SnippetResponseDTO> {
        const user = await this.userService.findByUsername(userName);

        if (user!) {
            throw new UnauthorizedException("User not found with the given username");
        }
        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetId
            },
            relations: {
                user: true
            }
        });

        if (!snippetFound) {
            throw new NotFoundException("cannot find the particular snippet with the ID")
        }

        //count the snippetVersions only
        const snippetVersions=await this.snippetVersionRepo.count({
            where:{
                snippet:{
                    id:snippetId, 
                } 
            },
            
        })

        const response = new SnippetResponseDTO();


        response.id = snippetFound.id;
        response.title = snippetFound.title;
        response.description = snippetFound.description;
        response.code = snippetFound.code;
        response.language = snippetFound.language;
        response.tags = snippetFound.tag;
        response.versions = snippetVersions;
        response.shareToken = snippetFound.shareToken;
        response.createdAt = snippetFound.createdAt;
        response.updatedAt = snippetFound.updatedAt;

        return response;

    }

    //find all the snippets
    async getAllSnippets(userName: string): Promise<SnippetResponseDTO[]> {

        const userFound = this.userService.findByUsername(userName);

        const snippetsFound = await this.snippetRepo.find({
            relations: {
                user: true
            }
        })

        if (!snippetsFound) {
            throw new NotFoundException("You haven't created any snippet")
        }

        return await Promise.all (snippetsFound.map(async(snippet) => {
            const response = new SnippetResponseDTO()
            const snippetId=snippet.id;

            const versionCount=await this.snippetVersionRepo.count({
                where:{
                    snippet:{
                        id:snippetId
                    }
                }
            })

            response.id = snippetId;
            response.title = snippet.title;
            response.description = snippet.description;
            response.code = snippet.code;
            response.language = snippet.language;
            response.tags = snippet.tag;
            response.versions = versionCount;
            response.shareToken = snippet.shareToken;
            response.createdAt = snippet.createdAt;
            response.updatedAt = snippet.updatedAt;

            return response;
        }))
    }

    //-----------Update Snippet---------------------------
    async updateSnippet(userName: string, snippetId: number ){

    }

    //find the current snippet
    //create the snippetversion of the current snippet

            // Set version number
        // Maintain both sides of relationship
        // Save version
        // Update snippet with new values
        // Save updated snippet
        // Prepare response



}