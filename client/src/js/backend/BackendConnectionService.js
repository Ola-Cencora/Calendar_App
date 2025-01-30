import mockData from "./mockData.json";

export class BackendConnectionService {
  constructor() {
    this.apiUrl = "http://localhost:8000/api/events";
    this.events = [];
  }

  async init() {
    try {
      const response = await fetch(this.apiUrl);
      this.events = await response.json();
    } catch (error) {
      console.error("Błąd podczas pobierania danych:", error);
    }
  }

  async fetchEvents() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error("Failed to fetch events");
      this.events = await response.json();
      if (this.onDataUpdate) this.onDataUpdate(this.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  async getEventById(eventId) {
    try {
      const response = await fetch(`${this.apiUrl}/${eventId}`);
      if (!response.ok) throw new Error("Event not found");
      return await response.json();
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  }

  async addEvent(selectedDate, eventData) {
    try {
      const response = await fetch(`${this.apiUrl}/${selectedDate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          userId: 101,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add event: ${errorData.message || response.statusText}`
        );
      }

      await this.fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  }

  async updateEvent(eventId, selectedDate, updatedEventData) {
    try {
      const response = await fetch(`${this.apiUrl}/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedEventData.title,
          description: updatedEventData.description,
          startDate: updatedEventData.startDate,
          endDate: updatedEventData.endDate,
          date: selectedDate,
          userId: 101,
        }),
      });
      if (!response.ok) throw new Error("Failed to update event");
      await this.fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  }

  async deleteAllEvents(selectedDate) {
    try {
      const response = await fetch(`${this.apiUrl}/date/${selectedDate}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete all events");
      await this.fetchEvents();
    } catch (error) {
      console.error("Error deleting all events:", error);
    }
  }

  async deleteEvent(eventId, selectedDate) {
    try {
      const response = await fetch(`${this.apiUrl}/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      await this.fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }
}
