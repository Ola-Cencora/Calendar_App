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
