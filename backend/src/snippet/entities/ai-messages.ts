import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {Snippet} from "./snippet-entities";
import {SnippetVersions} from "./snippet-versions-entities";

@Entity()
export class AiMessages {

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    prompt!:string;
    
    @Column()
    response!:string;

    @CreateDateColumn()
    createdAt!:Date;

    @ManyToOne(
        ()=>Snippet,
        (snippet)=>snippet.aiMessages
    )
    snippet!:Snippet;

    @ManyToOne(
        ()=>SnippetVersions,
        (snippetVersion)=>snippetVersion.aiMessages
    )
    snippetVersion!:SnippetVersions;
}