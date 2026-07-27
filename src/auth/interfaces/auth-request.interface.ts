//we are making this interface in order to extract the username, userId from request which has been passed from the jwt and we will use this interface whereever we need the userId and username
import { Request } from "@nestjs/common"

export interface AuthRequest extends Request{
    user: {
        userId: number,
        userName: string
    }
}