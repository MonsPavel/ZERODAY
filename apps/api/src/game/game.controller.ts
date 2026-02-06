import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameStateDto } from './dto/game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('game')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('state')
  @ApiOkResponse({ type: GameStateDto })
  async getState(@Req() req: { user: { id: string } }) {
    return this.gameService.computeTodayState(req.user.id);
  }
}
