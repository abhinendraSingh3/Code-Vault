import { User } from "../../users/entities/user.entity"

export class ResponseDto{

    userName!: string

    firstName!: string

    lastName!: string

    email!: string

    token!: string

    constructor(user:User){

        this.firstName=user.firstName
        this.email=user.email
        this.lastName=user.lastName
        this.userName=user.userName

    }

}