import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity"
import { SnippetVersions } from "./snippet-versions-entities";

@Entity()
export class Snippet{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: false, type: 'varchar'})
    title!: string;

    //in text the long description of code can be there
    @Column({nullable: false, type: 'text'})
    description!: string

    @Column({nullable: false, type: 'text'})
    code!: string

    @Column({nullable: false})
    language!: string;

    @Column('simple-array')
    tag!: string[];

    @Column({unique: true})
    shareToken!: number;

    @CreateDateColumn()
    expiryTime!: Date;

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(
        ()=>User,
        (user)=>user.snippet 

    )
    user!: User;

    @OneToMany(
        ()=>SnippetVersions,
        (snippetVersion)=>snippetVersion.snippet
    )
    snippetVersion!: SnippetVersions[];

    //()=>User .represents that this entity has a relationship with User entity
    //(user)=>user.snippet. means that go to user entity and find the property that points back to snippet. user can be anything its just the variable name.


}