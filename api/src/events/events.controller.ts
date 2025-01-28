import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getAll() {
    return this.eventsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post(':date')
  addEvent(
    @Param('date') date: string,
    @Body()
    createEventDto: CreateEventDto,
  ) {
    return this.eventsService.addEvent(createEventDto, date);
  }

  @Patch(':date/:id')
  update(
    @Param('date') date: string,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(date, id, updateEventDto);
  }

  @Delete(':date/:id')
  delete(@Param('date') date: string, @Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(date, id);
  }

  @Delete(':date')
  deleteAll(@Param('date') date: string) {
    return this.eventsService.deleteAll(date);
  }
}
