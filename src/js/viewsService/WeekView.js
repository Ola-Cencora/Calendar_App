import CalendarView from "./CalendarView";

class WeekView extends CalendarView {
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

  addDayEvents(dayDateString, dayElement) {
    const eventsForDay = this.checkDayEvents(dayDateString);

    if (eventsForDay.length > 0) {
      const eventContainer = document.createElement("div");
      eventContainer.className = `week__view__grid___day-cell__event-container`;

      eventsForDay.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.className = `week__view__grid___day-cell__event-container___event`;

        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        const startTime = startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (startDate.getHours() === 0 && endDate.getHours() === 23) {
          eventElement.innerHTML = event.title;

          eventElement.style.position = "relative";
          eventElement.style.height = "40px";
          eventElement.style.top = "20px";
          eventElement.style.textTransform = "uppercase";
        } else {
          eventElement.innerHTML = `${event.title} <br> ${startTime} - ${endTime}`;

          const eventDurationInMinutes = (endDate - startDate) / 60000;
          const eventStartOffsetInMinutes =
            startDate.getHours() * 60 + startDate.getMinutes() - 5 * 60;

          const topOffset = (eventStartOffsetInMinutes / (18 * 60)) * 600;
          const height = (eventDurationInMinutes / (18 * 60)) * 600;

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
      this.addDayEvents(dayDateString, dayElement);

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
    this.addTime(weekCalendarTime, "week");
    this.container.appendChild(weekCalendar);
    this.highlightToday(grid, { month, year }, "week");
    this.highlightWeekends(grid, month, year, "week");
  }
}

export default WeekView;
