import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAll() {
    return this.eventsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Post(':date')
  addEvent(
    @Param('date') date: string,
    @Body()
    event: {
      title: string;
      description: string;
      userId: number | null;
      startDate: string;
      endDate: string;
    },
  ) {
    return this.eventsService.addEvent(event, date);
  }

  @Patch(':date/:id')
  update(
    @Param('date') date: string,
    @Param('id') id: string,
    @Body()
    eventUpdate: {
      title?: string;
      description?: string;
      userId?: number | null;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.eventsService.update(date, +id, eventUpdate);
  }

  @Delete(':date/:id')
  delete(@Param('date') date: string, @Param('id') id: string) {
    return this.eventsService.delete(date, +id);
  }

  @Delete(':date')
  deleteAll(@Param('date') date: string) {
    return this.eventsService.deleteAll(date);
  }
}
