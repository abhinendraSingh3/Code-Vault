import { IsString } from "class-validator";
import { Snippet } from "../../snippet/entities/snippet-entities";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true, nullable: false})
    userName!: string;

    @Column({nullable: false, length: 50})
    firstName!: string;

    @Column({nullable: false})
    lastName!: string;

    @Column({unique: true})
    email!: string;

    @Column({nullable: false})
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date

    @OneToMany(
        ()=>Snippet,
        (snippet)=>snippet.user
    )
    snippet!: Snippet[]

    //() => Snippet
    //This entity has a relationship with the Snippet entity.
    //(snippet)=> snippet.userId- means that go to snippet entity and find the property that points back to user.





}