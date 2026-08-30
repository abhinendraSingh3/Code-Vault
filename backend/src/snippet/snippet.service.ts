import { Controller, ForbiddenException, Injectable, NotFoundException, NotImplementedException, UnauthorizedException } from "@nestjs/common";
import { SnippetReqDTO } from "./dto/snippet-request";
import { UserService } from "../users/users.services";
import { InjectRepository } from "@nestjs/typeorm";
import { Snippet } from "./entities/snippet-entities";
import { ILike, Not, Repository } from "typeorm";
import { SnippetResponseDTO } from "./dto/snippet-response";
import { SnippetVersions } from "./entities/snippet-versions-entities";
import { randomUUID } from "crypto";
import { ShareTokenResDTO } from "./dto/share-token-response";
import { ConfigService } from "@nestjs/config";
import { ShareToken } from "./entities/snippet-shareToken";
import { SnippetSumamryDTO } from "./dto/snippet-summary";
import { User } from "../users/entities/user.entity";
import { count, error, log } from "console";
import { AllSharedSnippets } from "./dto/allSharedSnippetDetails";
import { share } from "rxjs";

@Injectable()
export class SnippetService {

    constructor(

        @InjectRepository(Snippet)
        private readonly snippetRepo: Repository<Snippet>,

        @InjectRepository(SnippetVersions)
        private readonly snippetVersionRepo: Repository<SnippetVersions>,

        @InjectRepository(ShareToken)
        private readonly shareTokenRepo: Repository<ShareToken>,

        private readonly userService: UserService,

        private readonly configService: ConfigService,

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
        await this.snippetRepo.save(snippetCreated);

        const response = new SnippetResponseDTO()

        response.id = snippetCreated.id
        response.title = snippetCreated.title
        response.description = snippetCreated.description
        response.code = snippetCreated.code
        response.language = snippetCreated.language
        response.tags = snippetCreated.tag
        response.shareToken = snippetCreated.shareToken
        response.versions = 0
        response.createdAt = snippetCreated.createdAt
        response.updatedAt = snippetCreated.updatedAt

        return response;
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
    async getAllSnippets(page: number, limit: number, userName: string) {
        console.log("the page is", page);

        const skip = (page - 1) * limit;

        const userFound = await this.userService.findByUsername(userName);

        if (!userFound) {
            throw new NotFoundException("User not found");
        }

        const [snippetsFound, total] = await this.snippetRepo.findAndCount({
            where: {
                user: {
                    userName: userName
                }
            },
            relations: {
                user: true,
                snippetVersion: true
            },
            skip: skip,
            take: limit,
            order: { createdAt: "DESC" }
        })


        if (!snippetsFound || snippetsFound.length === 0) {
            throw new NotFoundException("You haven't created any snippet")
        }

        try {
            const data = await Promise.all(snippetsFound.map(async (snippet) => {

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
            console.log(data, total)
            return {
                data,
                total,
                page,
                totalPageNumbers: Math.ceil(total / limit)
            };
        }
        catch (error) {
            console.log("L");
            throw new NotImplementedException("Kutch na hua")
        }
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
    async deleteSnippet(userId: number, snippetID:number) {
        const user = await this.userService.findByUserId(userId)

        if (!user) {
            throw new NotFoundException("No user found with this username");
        }

        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetID,
                user:{
                    id:userId
                }
            },
            relations: {
                user: true
            }
        })

        // const snippetVersions=await this.snippetVersionRepo.find({
        //     where:{
        //         snippet:{
        //             id:snippetID
        //         }
        //     },
        //     relations:{
        //         snippet:true
        //     }
        // })



        if (!snippetFound) {
            throw new NotFoundException("Snippet Not Found");
        }

        if (snippetFound.user.id !== user.id) {
            throw new ForbiddenException("You cannot delete this snippet");
        }

        await this.snippetVersionRepo.delete({snippet:{id:snippetID}})
        await this.shareTokenRepo.delete({snippet:{id:snippetID}})
        await this.snippetRepo.remove(snippetFound);


        return "Snippet Delete Successfully";


    }

    //-------------get by langauge-----------------------
    async getByLanguage(language: string, userId: number) {
        console.log("reaching service of lang");


        const user = await this.userService.findByUserId(userId);


        if (!user) {
            throw new NotFoundException("User not found");
        }

        const snippetsFound = await this.snippetRepo.find({
            where: [
                {
                    user: {
                        id: userId
                    },
                    language: ILike(language)
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        language: ILike(language)
                    }
                }
            ],
            relations: {
                snippetVersion: true,
                user: true
            }
        });


        if (snippetsFound.length === 0) {
            // console.log("reching error");

            throw new NotFoundException("Snippet Not Found");
        }
        // console.log(snippetsFound);


        return snippetsFound.map(snippet => {

            const response = new SnippetResponseDTO();

            response.id = snippet.id;
            response.title = snippet.title;
            response.description = snippet.description;
            response.code = snippet.code;

            response.language =
                snippet.language.toLowerCase() === language.toLowerCase()
                    ? snippet.language
                    : language;

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
                    title: ILike(title)
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        title: ILike(title)
                    }
                }
            ],
            relations: {
                snippetVersion: true
            }
        })


        if (snippetsFound.length === 0) {
            throw new NotFoundException("Cannot find the snippet with the given title")
        }

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
                    language: ILike(`%${anyKeyword}%`)
                },
                {
                    user: {
                        id: userId
                    },
                    title: ILike(`%${anyKeyword}%`)
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        language: ILike(`%${anyKeyword}%`)
                    }
                },
                {
                    user: {
                        id: userId
                    },
                    snippetVersion: {
                        title: ILike(`%${anyKeyword}%`)
                    }
                }
            ],
            relations: {
                user: true,
                snippetVersion: true
            }

        })

        if (snippetFound.length == 0) {
            throw new NotFoundException("No Code Snippet Found")
        }



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

    //generate token by SnippetID
    // generate token by SnippetID
    async generateTokenBySnippetId(
        snippetId: number,
        userId: number
    ): Promise<ShareTokenResDTO> {

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found");
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
            throw new NotFoundException(
                "Cannot find the particular snippet with the ID"
            );
        }

        if (snippetFound.user.id !== userId) {
            throw new ForbiddenException(
                "You are not allowed to generate a share link for this snippet"
            );
        }

        const port = this.configService.get<number>("port");

        // Token expires after 10 minutes
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);

        const token = randomUUID();

        // Check whether this snippet already has a share token
        let shareToken = await this.shareTokenRepo.findOne({
            where: {
                snippet: {
                    id: snippetId
                }
            },
            relations: {
                snippet: true
            }
        });

        if (shareToken) {

            // Existing token → regenerate/update it
            shareToken.token = token;
            shareToken.type = "SNIPPET";
            shareToken.targetId = snippetId;
            shareToken.expiryTime = expiryTime;

        } else {

            // No token exists → create one
            shareToken = this.shareTokenRepo.create({
                token: token,
                type: "SNIPPET",
                targetId: snippetId,
                expiryTime: expiryTime,
                snippet: snippetFound
            });
        }

        await this.shareTokenRepo.save(shareToken);

        console.log("this is the share token", shareToken);

        const response = new ShareTokenResDTO();

        response.expiresAt = shareToken.expiryTime;
        response.token = shareToken.token;
        response.url = `http://localhost:${port}/snippet/getSnippet/${shareToken.token}`;

        return response;
    }

    //generate token by version id
    async generateTokenBySnippetVersionId(snippetId: number, versionId: number, userId: number) {

        const user = await this.userService.findByUserId(userId);


        if (!user) {
            throw new NotFoundException("User not found")
        }

        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetId,

                snippetVersion: {
                    id: versionId
                }
            },
            relations: {
                user: true,
                snippetVersion: true,
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

        const token = randomUUID();

        const shareToken = new ShareToken();

        shareToken.token = token;
        shareToken.targetId = versionId
        shareToken.type = "SNIPPET_VERSION"
        shareToken.expiryTime = expiryTime;

        await this.shareTokenRepo.save(shareToken);

        const response = new ShareTokenResDTO();
        response.expiresAt = shareToken.expiryTime;
        response.token = token;
        response.url = `http://localhost:${port}/snippet/getSnippet/${token}`;

        return response;


    }

    //get the snippet by the token
    async getSharedSnippetByToken(token: string) {

        const shareToken = await this.shareTokenRepo.findOne({
            where: {
                token: token
            }
        });

        if (!shareToken) {
            throw new NotFoundException("No Snippet Found");
        }

        console.log(
            "expiry time:",
            shareToken.expiryTime.getTime()
        );

        console.log(
            "current time:",
            Date.now()
        );

        // Check expiry
        if (Date.now() > shareToken.expiryTime.getTime()) {

            // Delete expired token
            await this.shareTokenRepo.remove(shareToken);

            throw new UnauthorizedException(
                "Share Link has expired"
            );
        }

        // SNIPPET
        if (shareToken.type === "SNIPPET") {

            const snippetFound = await this.snippetRepo.findOne({
                where: {
                    id: shareToken.targetId
                },
                relations: {
                    snippetVersion: true
                }
            });

            if (!snippetFound) {
                throw new NotFoundException("Snippet not found");
            }

            const response = new SnippetResponseDTO();

            response.id = snippetFound.id;
            response.title = snippetFound.title;
            response.description = snippetFound.description;
            response.code = snippetFound.code;
            response.language = snippetFound.language;
            response.tags = snippetFound.tag;
            response.shareToken = snippetFound.shareToken;
            response.versions = snippetFound.snippetVersion.length;
            response.createdAt = snippetFound.createdAt;
            response.updatedAt = snippetFound.updatedAt;

            return response;
        }

        // SNIPPET_VERSION
        if (shareToken.type === "SNIPPET_VERSION") {

            const snippetVersionFound =
                await this.snippetVersionRepo.findOne({
                    where: {
                        id: shareToken.targetId
                    },
                    relations: {
                        snippet: true
                    }
                });

            if (!snippetVersionFound) {
                throw new NotFoundException(
                    "Snippet version not found"
                );
            }

            const response = new SnippetResponseDTO();

            response.id = snippetVersionFound.id;
            response.title = snippetVersionFound.title;
            response.description = snippetVersionFound.description;
            response.code = snippetVersionFound.code;
            response.language = snippetVersionFound.language;
            response.tags = snippetVersionFound.tag;
            response.shareToken = snippetVersionFound.shareToken;
            response.createdAt = snippetVersionFound.createdAt;
            response.updatedAt = snippetVersionFound.updatedAt;

            return response;
        }

        throw new NotFoundException("Invalid share token type");
    }

    //get snippet versions summary
    async getSnippetsVersions(snippetId: number, userId: number) {
        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetId
            },
            relations: {
                snippetVersion: true
            }
        })

        if (!snippetFound) {
            throw new NotFoundException("Snippet Not Found")
        }

        return snippetFound.snippetVersion.map((version) => {

            const response = new SnippetSumamryDTO();
            response.id=version.id
            response.title = version.title;
            response.description = version.description
            response.versionNumber = version.versions;
            response.UpdatedAt = version.createdAt;

            return response;
        });

    }

    //get snippet by Id & Version Number
    async getSnippetByIdAndVersionNumber(
        snippetId: number,
        versionNumber: number,
        userId: number) {

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }


        const snippetFound = await this.snippetRepo.findOne({
            where: {
                id: snippetId
            },
            relations: {
                user: true,
                snippetVersion: true
            }
        });


        if (!snippetFound) {
            throw new NotFoundException("Snippet Not Found");
        }


        if (snippetFound.user.id !== userId) {
            throw new ForbiddenException(
                "You cannot access this snippet"
            );
        }


        const versionFound = snippetFound.snippetVersion.find(
            (version) => version.versions === versionNumber
        );


        if (!versionFound) {
            throw new NotFoundException(
                "Version not found"
            );
        }


        const response = new SnippetResponseDTO();

        response.id = versionFound.id;
        response.title = versionFound.title;
        response.description = versionFound.description;
        response.code = versionFound.code;
        response.language = versionFound.language;
        response.tags = versionFound.tag;
        response.shareToken = versionFound.shareToken;
        response.versions = versionFound.versions;
        response.createdAt = versionFound.createdAt;
        response.updatedAt = versionFound.updatedAt;


        return response;
    }

    //get the latest snippets of the user
    async getRecentSnippets(userId: number) {

        const snippets = await this.snippetRepo.find({
            where: { user: { id: userId } },
            relations: { snippetVersion: true, user: true }
        })

        if (!snippets) {
            throw new NotFoundException("cannot find the snippets with the given id");
        }

        const totalLength = snippets.length;

        const orderSnippets = snippets
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3);

        const recentSnippets = orderSnippets.map((snippet) => {
            const response = new SnippetResponseDTO();

            response.id = snippet.id
            response.code = snippet.code
            response.language = snippet.language
            response.title = snippet.title
            response.versions = snippet.snippetVersion.length;
            response.tags = snippet.tag;
            response.createdAt = snippet.createdAt
            response.updatedAt = snippet.updatedAt
            response.shareToken = snippet.shareToken
            response.description = snippet.description

            return response;
        })

        return { totalLength, recentSnippets };
    }

    async getAllSnippetsOfUsers(userName: string) {


        const userFound = await this.userService.findByUsername(userName);

        if (!userFound) {
            throw new NotFoundException("User not found");
        }

        const snippetsFound = await this.snippetRepo.find({
            where: {
                user: {
                    userName: userName
                }
            },
            relations: {
                user: true,
                snippetVersion: true
            },
        })

        if (!snippetsFound || snippetsFound.length === 0) {
            throw new NotFoundException("You haven't created any snippet")
        }

        try {
            const data = await Promise.all(snippetsFound.map(async (snippet) => {

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
            return data

        }
        catch (error) {
            console.log("L");
            throw new NotImplementedException("Kutch na hua")
        }
    }

    //make api which should return an array of language with each language count, rest return data of the searched snippet
    async getTotalLanguage(userId: number) {

        const snippetFound = await this.snippetRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                user: true
            }
        })

        const languageCount = snippetFound.reduce((acc, snippet) => {
            const language = snippet.language;
            acc[language] = (acc[language] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(languageCount)
            .map(([language, count]) => (
                {
                    languages: language,
                    count: Number(count)
                }
            ))
    }

    //---------------
    async getAllSharedSnippetsDetails(userId: number): Promise<AllSharedSnippets[]> {
        console.log(userId);


        const snippets = await this.snippetRepo.find({
            where: {
                user: {
                    id: userId
                }
            },
            relations: {
                sharetoken: true,
                user: true
            }
        })

        if (!snippets) {

            throw new NotFoundException("No Snippets found")

        }
        console.log(snippets);



        const sharedTokensnippets = snippets
            .filter(snippet => snippet.sharetoken)
            .map((snippet) => ({
                snippetId: snippet.id,
                snippetName: snippet.title,
                shareToken: snippet.sharetoken.token,
                snippetType: snippet.sharetoken.type
            }))
        console.log(sharedTokensnippets);


        if (sharedTokensnippets.length === 0) {
            throw new NotFoundException("No shared token found")
        }

        return sharedTokensnippets

    }

    async deleteVersion(userId:number, snippetId:number, versionId:number){
        const user = await this.userService.findByUserId(userId)

        if (!user) {
            throw new NotFoundException("No user found with this username");
        }

        const snippetVersionFound = await this.snippetVersionRepo.findOne({
            where: {
                id: versionId,
                snippet:{
                    id:snippetId
                }
            },
            relations: {
                snippet:{
                    user:true
                }
            }
        })

        if (!snippetVersionFound) {
            throw new NotFoundException("Snippet Not Found");
        }

        if (snippetVersionFound.snippet.user.id !== user.id) {
            throw new ForbiddenException("You cannot delete this snippet");
        }

        await this.snippetVersionRepo.delete(versionId)
        await this.shareTokenRepo.delete(versionId)


        return "Snippet Delete Successfully";

        
    }



}

