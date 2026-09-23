import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SnippetVersions } from '../snippet/entities/snippet-versions-entities';

import { AiMessages } from './entities/ai-messages';
import { UserService } from '../users/users.services';
import { Snippet } from '../snippet/entities/snippet-entities';
import Groq from 'groq-sdk';

import dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AiService {

constructor(
  private readonly userService: UserService,

  @InjectRepository(Snippet)
  private readonly snippetRepository: Repository<Snippet>,

  @InjectRepository(SnippetVersions)
  private readonly snippetVersionRepository: Repository<SnippetVersions>,

  @InjectRepository(AiMessages)
  private readonly aiMessageRepository: Repository<AiMessages>,
) {}

    //this is the part for the AI implementation.--------------------------------
    async askAi(body: any, userId: number) {

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        let snippetId = body.snippetId;
        let versionId: number | undefined = body.versionId;
        let prompt = body.prompt;

            
        if (versionId && snippetId) {
            console.log(snippetId, versionId, prompt);

            let version = await this.snippetVersionRepository.findOne({
                where: {
                    id: versionId,
                    snippet: {id:snippetId}
                },
                relations: {
                    snippet: true,
                    aiMessages: true
                }
            })
            console.log(version);
            



            if (version?.code) {
                const response = await this.aiProcedure(version.code, prompt);
                if (response) {

                    const aiMessageEntityData = this.aiMessageRepository.create({
                        snippet: { id: snippetId },
                        snippetVersion: { id: versionId },
                        prompt,
                        response
                    })
                    await this.aiMessageRepository.save(aiMessageEntityData);
                    console.log("response saved of versionID");
                }
                return response;
            }

        }

        else if (snippetId && !versionId) {
            let snippet = await this.snippetRepository.findOne({
                where: {
                    id: snippetId
                },
                relations: {
                    aiMessages: true
                }
            })
            if (snippet?.code) {
                const response = await this.aiProcedure(snippet.code, prompt);

                if (response) {

                    const aiMessageEntityData = this.aiMessageRepository.create({
                        snippet: { id: snippetId },
                        prompt,
                        response
                    })
                    await this.aiMessageRepository.save(aiMessageEntityData);
                    console.log("response saved of snippetID");
                    
                }


                return response
            }

        }

    }
    //------------------this is actual implementation of ai backend
    async aiProcedure(code: string, prompt: string) {

        let apiKey = process.env.apiKey;

        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not set in the environment variables.");
        }

        const systemPrompt = `
            You are a coding assistant.

            Analyze the provided code and answer the user's asked question only.
            Dont give user additional information apart from the asked question
            Give clear and concise explanations.
            `;

        const userPrompt = `
            Code:

                \`\`\`
                 ${code}
                 \`\`\`

        User question:
            ${prompt}
                 `;

        const groq = new Groq({ apiKey: apiKey });


        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    content: systemPrompt
                },
                {
                    "role": "user",
                    "content": userPrompt
                }
            ],
            "model": "openai/gpt-oss-120b",
            "temperature": 1,
            "max_completion_tokens": 2048,
            "top_p": 1,
            "stream": false,
            "reasoning_effort": "medium",
            "stop": null
        });

        // for await (const chunk of chatCompletion) {
        //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
        // }
        const reponse = chatCompletion.choices[0]?.message?.content;
        console.log("the response of ai is ", reponse);

        return reponse;

    }
}


  
