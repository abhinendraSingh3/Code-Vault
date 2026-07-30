import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity"

export class SnippetReqDTO{

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

}