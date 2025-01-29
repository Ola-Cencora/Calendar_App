import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';

@Injectable()
export class EventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    const events = await this.databaseService.event.findMany();

    const groupedEvents: Record<
      string,
      {
        date: string;
        events: Array<{
          id: number;
          title: string;
          description: string;
          time: string;
          userId: number | null;
          startDate: Date;
          endDate: Date;
        }>;
      }
    > = {};

    events.forEach((event) => {
      const date = event.date.toISOString().split('T')[0];

      if (!groupedEvents[date]) {
        groupedEvents[date] = { date, events: [] };
      }

      groupedEvents[date].events.push({
        id: event.id,
        title: event.title,
        description: event.description,
        time: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(event.startDate)),
        userId: event.userId,
        startDate: event.startDate,
        endDate: event.endDate,
      });
    });

    return Object.values(groupedEvents);
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
