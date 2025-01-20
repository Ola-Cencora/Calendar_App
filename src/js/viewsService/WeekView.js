import CalendarView from "./CalendarView";

class WeekView extends CalendarView {
  addTime(weekCalendarTime) {
    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = document.createElement("div");
      timeSlot.className = "week__time___slot";

      const formattedHour = hour.toString().padStart(2, "0") + ":00";
      timeSlot.textContent = formattedHour;

      weekCalendarTime.appendChild(timeSlot);
    }
  }

  renderDomElements() {
    const weekCalendar = document.createElement("div");
    weekCalendar.className = "week";

    const weekCalendarView = document.createElement("div");
    weekCalendarView.className = "week__view";
    weekCalendar.appendChild(weekCalendarView);

    const weekCalendarTime = document.createElement("div");
    weekCalendarTime.className = "week__time";
    weekCalendar.appendChild(weekCalendarTime);

    return { weekCalendar, weekCalendarView, weekCalendarTime };
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    return startOfWeek;
  }

  addDayEvents(dayDateString, dayElement, view) {
    const eventsForDay = this.checkDayEvents(dayDateString);

    if (eventsForDay.length > 0) {
      const eventContainer = document.createElement("div");
      eventContainer.className = `${view}__view__grid___day-cell__event-container`;

      eventsForDay.forEach((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        const isAllDayEvent =
          startDate.getHours() === 0 &&
          startDate.getMinutes() === 0 &&
          endDate.getHours() === 23 &&
          endDate.getMinutes() === 59;

        const eventElement = document.createElement("div");
        eventElement.className = `${view}__view__grid___day-cell__event-container___event`;
        eventElement.textContent = event.title;

        if (isAllDayEvent) {
          eventElement.style.position = "relative";
          eventElement.style.height = "40px";
          eventElement.style.top = "0";
        } else {
          const startHour = startDate.getHours();
          const startMinutes = startDate.getMinutes();
          const endHour = endDate.getHours();
          const endMinutes = endDate.getMinutes();

          const eventDurationInMinutes =
            endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
          const eventStartOffsetInMinutes = startHour * 60 + startMinutes;

          const totalGridHeight = 800;
          const minutesInDay = 24 * 60;

          const topOffset =
            (eventStartOffsetInMinutes / minutesInDay) * totalGridHeight;
          const height =
            (eventDurationInMinutes / minutesInDay) * totalGridHeight;

          eventElement.style.top = `${topOffset + 24}px`;
          eventElement.style.height = `${height}px`;
        }

        eventContainer.appendChild(eventElement);
      });

      dayElement.appendChild(eventContainer);
    }
  }

  addWeekDays(startOfWeek, grid) {
    for (let i = 0; i < 7; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "week__view__grid___day-cell cell";
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);

      const dayNumber = document.createElement("span");
      dayNumber.textContent = dayDate.getDate();
      dayElement.setAttribute("data-day", dayDate.getDate());
      dayElement.appendChild(dayNumber);

      const dayDateString = this.getDateString(
        dayDate.getFullYear(),
        dayDate.getMonth(),
        dayDate.getDate()
      );
      this.addDayEvents(dayDateString, dayElement, "week");

      grid.appendChild(dayElement);
    }
  }

  render(month, year, currentDate) {
    const { weekCalendar, weekCalendarView, weekCalendarTime } =
      this.renderDomElements();
    this.setViewName(month, year);
    this.nameWeekdays(weekCalendarView, "week");

    const startOfWeek = this.getStartOfWeek(currentDate);

    const grid = document.createElement("div");
    grid.className = "week__view__grid";
    weekCalendarView.appendChild(grid);

    this.addWeekDays(startOfWeek, grid);
    this.addTime(weekCalendarTime);
    this.container.appendChild(weekCalendar);
    this.highlightToday(grid, { month, year }, "week");
    this.highlightWeekends(grid, month, year, "week");
  }
}

export default WeekView;
