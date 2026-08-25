import { Entity } from "typeorm";

@Entity()
export class AllSharedSnippets{

    snippetId!:number
    snippetName! : string
    shareToken !: string
    snippetType! :string
}