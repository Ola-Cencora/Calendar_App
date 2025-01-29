import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    return this.databaseService.event.findMany();
  }

  async findOne(id: number) {
    const event = await this.databaseService.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async addEvent(createEventDto: CreateEventDto, date: string) {
    return this.databaseService.event.create({
      data: {
        ...createEventDto,
        date: new Date(date),
      },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    return this.databaseService.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async delete(id: number) {
    return this.databaseService.event.delete({
      where: { id },
    });
  }

  async deleteAll(date: string) {
    return this.databaseService.event.deleteMany({
      where: { date: new Date(date) },
    });
  }
}
