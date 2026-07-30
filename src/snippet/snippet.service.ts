import { Controller, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SnippetReqDTO } from "./dto/snippet-request";
import { UserService } from "../users/users.services";
import { InjectRepository } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { Repository } from "typeorm";
import { SnippetResponseDTO } from "./dto/snippet-response";
import { SnippetVersions } from "./entities/snippet-versions-entities";
import { randomUUID } from "crypto";
import { ShareTokenResDTO } from "./dto/share-token-response";
import { ConfigService } from "@nestjs/config";
import { NumericType } from "typeorm/driver/mongodb/typings.js";

@Injectable()
export class SnippetService {

    constructor(

        @InjectRepository(Snippet)
        private readonly snippetRepo: Repository<Snippet>,

        @InjectRepository(SnippetVersions)
        private readonly snippetVersionRepo: Repository<SnippetVersions>,

        private readonly userService: UserService,

        private readonly configService: ConfigService

    ) { }


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

        if (!user) {
            throw new NotFoundException("User not found with the given username");
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

        if (snippetFound.user.id !== user.id) {
            throw new ForbiddenException("You cannot update this snippet");
        }

        //count the snippetVersions only
        const snippetVersions = await this.snippetVersionRepo.count({
            where: {
                snippet: {
                    id: snippetId,
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

        return await Promise.all(snippetsFound.map(async (snippet) => {
            const response = new SnippetResponseDTO()
            const snippetId = snippet.id;

            const versionCount = await this.snippetVersionRepo.count({
                where: {
                    snippet: {
                        id: snippetId
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
    async updateSnippet(userName: string, snippetId: number, snippetData: SnippetReqDTO) {


        const user = await this.userService.findByUsername(userName);

        // find the current snippet
        const currSnippet = await this.snippetRepo.findOne({
            where: {
                id: snippetId
            },
            relations: {
                user: true,
                snippetVersion: true
            }
        });


        if (!currSnippet) {
            throw new NotFoundException("No snippet found with the snippetId");
        }

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // check ownership
        if (currSnippet.user.id !== user.id) {
            throw new ForbiddenException("You cannot update this snippet");
        }


        // create the snippetversion of the current snippet
        const newSnippetVersion = new SnippetVersions();

        newSnippetVersion.title = currSnippet.title;
        newSnippetVersion.description = currSnippet.description;
        newSnippetVersion.code = currSnippet.code;
        newSnippetVersion.language = currSnippet.language;
        newSnippetVersion.shareToken = currSnippet.shareToken;
        newSnippetVersion.tag = currSnippet.tag;
        newSnippetVersion.expiryTime = currSnippet.expiryTime;

        // relationship
        newSnippetVersion.snippet = currSnippet;


        // Set version number
        newSnippetVersion.versions = currSnippet.snippetVersion.length + 1;


        // Maintain both sides of relationship
        currSnippet.snippetVersion.push(newSnippetVersion);


        // Save version
        await this.snippetVersionRepo.save(newSnippetVersion);



        // Update snippet with new values

        if (snippetData.description != null) {
            currSnippet.description = snippetData.description;
        }

        if (snippetData.title != null) {
            currSnippet.title = snippetData.title;
        }

        if (snippetData.language != null) {
            currSnippet.language = snippetData.language;
        }

        if (snippetData.code != null) {
            currSnippet.code = snippetData.code;
        }

        if (snippetData.tag != null) {
            currSnippet.tag = snippetData.tag;
        }


        // Save updated snippet
        await this.snippetRepo.save(currSnippet);



        // Prepare response
        const response = new SnippetResponseDTO();

        response.id = currSnippet.id;
        response.title = currSnippet.title;
        response.description = currSnippet.description;
        response.code = currSnippet.code;
        response.language = currSnippet.language;
        response.tags = currSnippet.tag;
        response.shareToken = currSnippet.shareToken;
        response.versions = currSnippet.snippetVersion.length;
        response.createdAt = currSnippet.createdAt;
        response.updatedAt = currSnippet.updatedAt;

        return response;
    }

    //-------------deleteSnippet--------------------------
    async deleteSnippet(userName: string, snippetID) {
        const user = await this.userService.findByUsername(userName);

        if (!user) {
            throw new NotFoundException("No user found with this username");
        }

        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetID
            },
            relations: {
                user: true
            }
        })



        if (!snippetFound) {
            throw new NotFoundException("Snippet Not Found");
        }

        if (snippetFound.user.id !== user.id) {
            throw new ForbiddenException("You cannot delete this snippet");
        }

        await this.snippetRepo.remove(snippetFound);

        return "user Delete Successfully";


    }

    //-------------get by langauge-----------------------
    async getByLanguage(language: string, userId) {
        const user = await this.userService.findByUserId(userId);

        const snippetsFound = await this.snippetRepo.find({
            where: [
                {
                    user: {
                        id: userId
                    },
                    language: language
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        language: language
                    }

                }

            ],
            relations: {
                user: true,
                snippetVersion: true
            }

        })

        return snippetsFound.map((snippet) => {
            const response = new SnippetResponseDTO();

            response.id = snippet.id;
            response.title = snippet.title;
            response.description = snippet.description;
            response.code = snippet.code;
            response.language = snippet.language;
            response.tags = snippet.tag;
            response.shareToken = snippet.shareToken;
            response.versions = snippet.snippetVersion.length;
            response.createdAt = snippet.createdAt;
            response.updatedAt = snippet.updatedAt;

            return response;

        });

    }

    //getby title
    async getByTitle(title: string, userId: number) {
        const user = this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("Cannot find the user by this id");
        }

        const snippetsFound = await this.snippetRepo.find({
            where: [
                {
                    user: {
                        id: userId
                    },
                    title: title
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        title: title
                    }
                }
            ]
        })

        return snippetsFound.map((snippet) => {
            const response = new SnippetResponseDTO();

            response.id = snippet.id;
            response.title = snippet.title;
            response.description = snippet.description;
            response.code = snippet.code;
            response.language = snippet.language;
            response.tags = snippet.tag;
            response.shareToken = snippet.shareToken;
            response.versions = snippet.snippetVersion.length;
            response.createdAt = snippet.createdAt;
            response.updatedAt = snippet.updatedAt;

            return response;

        });
    }

    //search by any word
    async getByAnykeyword(anyKeyword: string, userId: number) {
        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const snippetFound = await this.snippetRepo.find({
            where: [
                {
                    user: {
                        id: userId
                    },
                    language: anyKeyword
                },
                {
                    user: {
                        id: userId
                    },
                    title: anyKeyword
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        language: anyKeyword
                    }
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        title: anyKeyword
                    }
                }
            ],
            relations: {
                user: true,
                snippetVersion: true
            }

        })

        return snippetFound.map((snippet) => {
            const response = new SnippetResponseDTO();

            response.id = snippet.id;
            response.title = snippet.title;
            response.description = snippet.description;
            response.code = snippet.code;
            response.language = snippet.language;
            response.tags = snippet.tag;
            response.shareToken = snippet.shareToken;
            response.versions = snippet.snippetVersion.length;
            response.createdAt = snippet.createdAt;
            response.updatedAt = snippet.updatedAt;

            return response;

        });
    }

    //generate token by SnippitID
    async generateTokenBySnippetId(snippetId: number, userId: number) {
        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found")
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

        if (snippetFound.user.id !== userId) {
            throw new NotFoundException("You are allowed to generate share link for this toke ")
        }

        const port = this.configService.get<number>('port');

        const expiryTime = new Date()

        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
        snippetFound.expiryTime = expiryTime;

        const token = randomUUID();
        snippetFound.shareToken = token;

        const response = new ShareTokenResDTO();
        response.expiresAt = expiryTime;
        response.token = token;
        response.url = "http://localhost:${port}/snippet/"+token;

        return response;

    }

    async generateTokenBySnippetVersionId(snippetId,versionId: number, userId: number){

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetId,

                snippetVersion:{
                    id:versionId
                }
            },
            relations: {
                user: true,
                snippetVersion:true,
            }
        });

        if (!snippetFound) {
            throw new NotFoundException("cannot find the particular snippet with the ID")
        }

        if (snippetFound.user.id !== userId) {
            throw new NotFoundException("You are allowed to generate share link for this toke ")
        }

        const port = this.configService.get<number>('port');

        const expiryTime = new Date()

        expiryTime.setMinutes(expiryTime.getMinutes() + 10);
        snippetFound.expiryTime = expiryTime;

        const token = randomUUID();
        snippetFound.shareToken = token;

        const response = new ShareTokenResDTO();
        response.expiresAt = expiryTime;
        response.token = token;
        response.url = "http://localhost:${port}/snippet/"+token;

        return response;

    }
    





}





