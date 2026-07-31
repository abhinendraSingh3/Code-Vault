import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from "typeorm";

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
}