import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Snippet } from "./snippet-entities";
import { SnippetVersions } from "./snippet-versions-entities";

@Entity()
export class ShareToken {


    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    token!: string;

    @Column()
    type!: string;
    // SNIPPET or SNIPPET_VERSION

    @Column()
    targetId!: number;

    @Column()
    expiryTime!: Date;

    @OneToOne(() => Snippet,
        (snippet) => snippet.sharetoken
    )
    @JoinColumn()
    snippet!: Snippet

    @OneToOne(() => SnippetVersions,
        (snippetVersion) => snippetVersion.sharetoken
    )

    @JoinColumn()
    snippetVersion!: SnippetVersions

//()=>User .represents that this entity has a relationship with User entity
//(user)=>user.snippet. means that go to user entity and find the property that points back to snippet. user can be anything its just the variable name.


}