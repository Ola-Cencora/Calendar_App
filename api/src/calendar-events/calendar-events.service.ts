import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CalendarEventsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCalendarEventDto: Prisma.EventCreateInput) {
    return this.databaseService.event.create({
      data: createCalendarEventDto,
    });
  }

  async findAll() {
    return this.databaseService.event.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.event.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCalendarEventDto: Prisma.EventUpdateInput) {
    return this.databaseService.event.update({
      where: { id },
      data: updateCalendarEventDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.event.delete({
      where: { id },
    });
  }
}
