import mockData from "./mockData.json";

export class BackendConnectionService {
  constructor() {
    this.events = [];
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
        time: event.time,
        userId: event.userId,
        startDate: event.startDate,
        endDate: event.endDate,
      })),
    }));
    return this.events;
  }
}
