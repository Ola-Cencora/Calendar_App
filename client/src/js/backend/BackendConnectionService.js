import mockData from "./mockData.json";

export class BackendConnectionService {
  constructor() {
    this.events = [];
  }

  getEventById(eventId) {
    for (const day of this.events) {
      const event = day.events.find(
        (ev) => ev.id.toString() === eventId.toString()
      );
      if (event) {
        return event;
      }
    }
    return null;
  }

  addEvent(selectedDate, eventData) {
    let day = this.events.find((day) => day.date === selectedDate);

    if (!day) {
      day = { date: selectedDate, events: [] };
      this.events.push(day);
    }

    const newEvent = {
      id: Date.now(),
      ...eventData,
      userId: null,
    };

    day.events.push(newEvent);
  }

  updateEvent(eventId, originalDate, updatedEventData) {
    const originalDay = this.events.find((day) => day.date === originalDate);

    if (originalDay) {
      const eventIndex = originalDay.events.findIndex(
        (event) => event.id.toString() === eventId.toString()
      );

      if (eventIndex !== -1) {
        const [event] = originalDay.events.splice(eventIndex, 1);

        if (originalDay.events.length === 0) {
          this.events = this.events.filter((day) => day.date !== originalDate);
        }

        Object.assign(event, updatedEventData);

        const newDate = updatedEventData.startDate.slice(0, 10);
        let newDay = this.events.find((day) => day.date === newDate);

        if (!newDay) {
          newDay = { date: newDate, events: [] };
          this.events.push(newDay);
        }

        newDay.events.push(event);
      }
    }

    if (this.onDataUpdate) {
      this.onDataUpdate(this.events);
    }
  }

  deleteAllEvents(selectedDate) {
    const dayIndex = this.events.findIndex((listElement) => {
      return listElement.date === selectedDate;
    });

    if (dayIndex !== -1) {
      this.events.splice(dayIndex, 1);
    }
  }

  deleteEvent(eventId, selectedDate) {
    const selectedDay = this.events.find((listElement) => {
      return listElement.date === selectedDate;
    });

    if (selectedDay) {
      const eventIndex = selectedDay.events.findIndex(
        (ev) => ev.id.toString() === eventId
      );

      if (eventIndex !== -1) {
        selectedDay.events.splice(eventIndex, 1);

        if (selectedDay.events.length === 0) {
          this.events = this.events.filter(
            (listElement) => listElement.date !== selectedDate
          );
        }
      }
    }
  }

  readData() {
    this.events = Object.entries(mockData).map(([date, dayData]) => ({
      date,
      events: dayData.events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        userId: event.userId,
        startDate: event.startDate,
        endDate: event.endDate,
      })),
    }));
    return this.events;
  }
}
