import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event-dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class EventsService {
  private calendarEvents: {
    date: string;
    events: {
      id: number;
      title: string;
      description: string;
      userId: number | null;
      startDate: string;
      endDate: string;
    }[];
  }[] = [
    {
      date: '2025-01-22',
      events: [
        {
          id: 1,
          title: 'Meeting with team',
          description:
            'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          userId: 101,
          startDate: '2025-01-22T10:00:00',
          endDate: '2025-01-22T11:00:00',
        },
        {
          id: 2,
          title: 'Lunch with client',
          description:
            'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          userId: 102,
          startDate: '2025-01-22T13:00:00',
          endDate: '2025-01-22T14:00:00',
        },
      ],
    },
    {
      date: '2025-01-23',
      events: [
        {
          id: 3,
          title: 'Project deadline',
          description:
            'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          userId: null,
          startDate: '2025-01-23T00:00:00',
          endDate: '2025-01-23T23:59:59',
        },
      ],
    },
    {
      date: '2025-01-24',
      events: [
        {
          id: 4,
          title: 'Workshop: Modern JavaScript',
          description:
            'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          userId: 103,
          startDate: '2025-01-24T14:00:00',
          endDate: '2025-01-24T16:00:00',
        },
        {
          id: 5,
          title: 'Team retrospective',
          description:
            'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
          userId: 101,
          startDate: '2025-01-24T16:30:00',
          endDate: '2025-01-24T17:30:00',
        },
      ],
    },
  ];

  getAll() {
    return this.calendarEvents;
  }

  findOne(id: number) {
    for (const day of this.calendarEvents) {
      const event = day.events.find((ev) => ev.id === id);

      if (!event) throw new NotFoundException('Event not found');

      return event;
    }
  }

  addEvent(createEventDto: CreateEventDto, date: string) {
    const highestId = this.calendarEvents
      .flatMap((day) => day.events)
      .reduce((maxId, ev) => Math.max(maxId, ev.id), 0);

    const newEvent = {
      id: highestId + 1,
      ...createEventDto,
    };

    let day = this.calendarEvents.find((d) => d.date === date);

    if (!day) {
      day = { date, events: [] };
      this.calendarEvents.push(day);
    }

    day.events.push(newEvent);

    return newEvent;
  }

  update(date: string, id: number, updateEventDto: UpdateEventDto) {
    const day = this.calendarEvents.find((d) => d.date === date);

    if (!day) {
      throw new Error(`Day with date ${date} not found`);
    }
    const eventIndex = day.events.findIndex((ev) => ev.id === id);
    if (eventIndex === -1) {
      throw new Error(`Event with id ${id} not found`);
    }
    day.events[eventIndex] = { ...day.events[eventIndex], ...updateEventDto };

    return day.events[eventIndex];
  }

  delete(date: string, id: number) {
    const removedEvent = this.findOne(id);

    this.calendarEvents = this.calendarEvents.map((day) => {
      return {
        date: day.date,
        events: day.events.filter((ev) => ev.id !== id),
      };
    });

    return removedEvent;
  }

  deleteAll(date: string) {
    const dayIndex = this.calendarEvents.findIndex((d) => d.date === date);

    if (dayIndex === -1) {
      throw new Error(`Day with date ${date} not found`);
    }

    const removedDay = this.calendarEvents.splice(dayIndex, 1);

    return removedDay[0];
  }
}
