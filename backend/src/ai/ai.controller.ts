import { Body, Controller, Post,  Req, UseGuards, } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from "../auth/jwt.auth.guard";
import type{ AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('ai')
export class AiController {

  constructor(
    private readonly aiService: AiService,
  ) {}

    @UseGuards(AuthGuard)
    @Post('askAi')
    async askAi(@Req() req: AuthRequest, @Body() body: any) {
        console.log("reached askAi");
        return this.aiService.askAi(body, req.user.userId);

    }
}