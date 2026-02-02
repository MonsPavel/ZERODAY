import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('health')
export class AppController {
  @Get('health')
  @ApiOkResponse({ schema: { example: { ok: true } } })
  getHealth() {
    return { ok: true };
  }
}
