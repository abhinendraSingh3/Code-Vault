import { Min, MinLength } from "class-validator"

export class ForgetPasswordDto{

    mail!: string

    @MinLength(8)
    newPassword!: string

    @MinLength(8)
    confirmNewPassword!: string


}