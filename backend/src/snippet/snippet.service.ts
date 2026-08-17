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
import { error, log } from "console";

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

        return "Snippet Delete Successfully";


    }

    //-------------get by langauge-----------------------
    async getByLanguage(language: string, userId: number) {

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        console.log(user);

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
                snippetVersion: true
            }
        });


        if (snippetsFound.length === 0) {
            throw new NotFoundException("Snippet Not Found");
        }


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
            throw new ForbiddenException("You are allowed to generate share link for this toke ")
        }

        const port = this.configService.get<number>('port');

        const expiryTime = new Date()
        expiryTime.setMinutes(expiryTime.getMinutes() + 10);

        const token = randomUUID();

        const shareToken = new ShareToken();

        shareToken.token = token;
        shareToken.targetId = snippetFound.id
        shareToken.type = "SNIPPET"
        shareToken.expiryTime = expiryTime;

        await this.shareTokenRepo.save(shareToken);
        console.log(shareToken)

        const response = new ShareTokenResDTO();
        response.expiresAt = shareToken.expiryTime;
        response.token = token;
        response.url = `http://localhost:${port}/snippet/getSnippet/${token}`;

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
        })

        if (!shareToken) {
            throw new NotFoundException("No Snippet Found")
        }
        console.log("expiry time: ", shareToken.expiryTime.getTime());
        console.log("current time: ", Date.now());


        if (Date.now() > shareToken.expiryTime.getTime()) {
            throw new UnauthorizedException("Share Link has expired")
        }

        if (shareToken.type === "SNIPPET") {
            const snippetId = shareToken.targetId;

            const snippetFound = await this.snippetRepo.findOne({
                where: {
                    id: snippetId
                },
                relations: {
                    snippetVersion: true
                }
            })

            if (!snippetFound) {
                throw new NotFoundException("snippet not found")
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

        else if (shareToken.type === "SNIPPET_VERSION") {
            const snippetVersionId = shareToken.targetId;

            const snippetFound = await this.snippetVersionRepo.findOne({
                where: {
                    id: snippetVersionId
                },
                relations: {
                    snippet: true
                }
            })

            if (!snippetFound) {
                throw new NotFoundException("snippet not found")
            }

            const response = new SnippetResponseDTO();

            response.id = snippetFound.id;
            response.title = snippetFound.title;
            response.description = snippetFound.description;
            response.code = snippetFound.code;
            response.language = snippetFound.language;
            response.tags = snippetFound.tag;
            response.shareToken = snippetFound.shareToken;
            response.createdAt = snippetFound.createdAt;
            response.updatedAt = snippetFound.updatedAt;

            return response;
        }

        return "Not Found"


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

            response.title = version.title;
            response.versionNumber = version.versions;
            response.createdAt = version.createdAt;

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

    //make api which should return an array of language with each language count,rest return data of the searched snippet

    async getTotalLanguage(userId: number) {

        const snippetFound = await this.snippetRepo.findAndCount({
            where:{
                user:{
                    id:userId
                },
                lan

            }
        })



}


}
