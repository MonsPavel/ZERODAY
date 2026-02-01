import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { HistoryDetailDto, HistoryResponseDto } from './dto/history.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

const isValidDate = (dateStr: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const parsed = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }
  const formatted = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed);
  return formatted === dateStr;
};

const assertValidDate = (dateStr: string) => {
  if (!isValidDate(dateStr)) {
    throw new BadRequestException({
      code: 'INVALID_DATE',
      message: 'Invalid date format (YYYY-MM-DD)',
    });
  }
};

@ApiTags('history')
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOkResponse({ type: HistoryResponseDto })
  getHistory(@Query() query: HistoryQueryDto) {
    return this.historyService.getHistory(query.days);
  }

  @Get(':date')
  @ApiOkResponse({ type: HistoryDetailDto })
  getDay(@Param('date') date: string) {
    assertValidDate(date);
    return this.historyService.getDayDetails(date);
  }
}
