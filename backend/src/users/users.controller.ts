import { Body, Controller, Get, Param, Put, NotFoundException } from "@nestjs/common";
import { UserService } from "./users.services";

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {} //DI

    @Get('profile/:id')
    async getProfile(@Param('id') id: string) {
        const userId = parseInt(id, 10);
        const user = await this.userService.findByUserId(userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        // Return profile data without password
        const { password, ...userProfile } = user;
        return userProfile;
    }

    @Put('profile/:id')
    async updateProfile(
        @Param('id') id: string,
        @Body() body: { firstName?: string; lastName?: string; email?: string; profilePic?: string; bio?: string }
    ) {
        const userId = parseInt(id, 10);
        const updatedUser = await this.userService.updateUserProfile(userId, body);
        if (!updatedUser) {
            throw new NotFoundException("User not found");
        }
        const { password, ...userProfile } = updatedUser;
        return userProfile;
    }

    @Put('reset-password/:id')
    async resetPassword(
        @Param('id') id: string,
        @Body() body: { currentPassword: string; newPassword: string }
    ) {
        const userId = parseInt(id, 10);
        return await this.userService.changePassword(userId, body.currentPassword, body.newPassword);
    }
}