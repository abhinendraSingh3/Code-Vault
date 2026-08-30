import { Column, CreateDateColumn, Entity, BeforeInsert, BeforeUpdate, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,OneToOne } from "typeorm";
import { User } from "../../users/entities/user.entity"
import { Snippet } from "./snippet-entities";
import { ShareToken } from "./snippet-shareToken";

@Entity()
export class SnippetVersions {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false, type: 'varchar' })
    title!: string;

    //in text the long description of code can be there
    @Column({ nullable: false, type: 'text' })
    description!: string

    @Column({ nullable: false, type: 'text' })
    code!: string

    @Column({ nullable: false })
    language!: string;


    @Column('simple-array')
    tag!: string[];

    @Column({ unique: true, nullable: true })
    shareToken!: string;

    @Column()
    versions!: number;

    @CreateDateColumn()
    expiryTime!: Date;

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date;


    @ManyToOne(
        () => Snippet,
        (originalSnippet) => originalSnippet.snippetVersion
    )
    snippet!: Snippet;

    @OneToOne(
        ()=>ShareToken,
        (sharetoken)=>sharetoken.snippetVersion
    )
    sharetoken!: ShareToken

    //()=>User .represents that this entity has a relationship with User entity
    //(user)=>user.snippet. means that go to user entity and find the property that points back to snippet. user can be anything its just the variable name.

}