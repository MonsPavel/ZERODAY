import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';
import { GameStateDto } from './dto/game.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('state')
  @ApiOkResponse({ type: GameStateDto })
  async getState() {
    return this.gameService.computeTodayState();
  }
}
