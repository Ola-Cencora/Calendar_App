import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('events')
export class EventsController {
  @Get()
  getAll() {
    return [];
  }

  @Post(':date')
  addEvent(@Param('date') date: string, @Body() event: {}) {
    return { date, event };
  }

  @Patch(':date/:id')
  update(
    @Param('date') date: string,
    @Param('id') id: string,
    @Body() eventUpdate: {},
  ) {
    return { date, id, ...eventUpdate };
  }

  @Delete(':date/:id')
  delete(@Param('date') date: string, @Param('id') id: string) {
    return { date, id };
  }

  @Delete(':date')
  deleteAll(@Param('date') date: string) {
    return date;
  }
}
