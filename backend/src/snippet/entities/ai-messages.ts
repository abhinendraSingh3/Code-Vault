import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import {Snippet} from "./snippet-entities";

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
}