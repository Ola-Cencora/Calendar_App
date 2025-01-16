import mockData from "./mockData.json";

export class BackendConnectionService {
  constructor() {
    this.events = [];
    this.readData();
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
