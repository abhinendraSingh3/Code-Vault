import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Snippet } from "./snippet-entities";

@Entity()
export class ShareToken {


    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique:true})
    token!: string;

    @Column()
    type!: string; 
    // SNIPPET or SNIPPET_VERSION

    @Column()
    targetId!: number;

    @Column()
    expiryTime!: Date;

    @OneToOne(()=>Snippet,
    (snippet)=>snippet.sharetoken
)
    @JoinColumn()
    snippet!: Snippet


}