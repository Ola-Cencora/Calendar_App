import mockData from "./mockData.json";

export class BackendConnectionService {
  constructor() {
    this.events = [];
  }

  deleteEvent(eventId, selectedDate) {
    const selectedDay = this.events.find((listElement) => {
      return listElement.date === selectedDate;
    });
    console.log("przed", selectedDay.events);

    const eventIndex = selectedDay.events.findIndex(
      (ev) => ev.id.toString() === eventId
    );
    if (eventIndex !== -1) {
      selectedDay.events.splice(eventIndex, 1);
    }
    console.log("po", selectedDay.events);
    console.log("index", eventIndex);
    //console.log(this.events);
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
