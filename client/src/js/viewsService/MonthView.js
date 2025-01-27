import CalendarView from "./CalendarView";

class MonthView extends CalendarView {
  renderWeekNumbers(monthCalendarWeeks, year, month) {
    function getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);

      return [d.getUTCFullYear(), weekNo];
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const seenWeeks = new Set();

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const [weekYear, weekNumber] = getWeekNumber(currentDate);

      if (!seenWeeks.has(`${weekYear}-${weekNumber}`)) {
        seenWeeks.add(`${weekYear}-${weekNumber}`);

        const weekNumberElement = document.createElement("div");
        weekNumberElement.textContent = `week ${weekNumber}`;
        if (weekYear !== year) {
          weekNumberElement.textContent += ` (${weekYear})`;
        }

        monthCalendarWeeks.appendChild(weekNumberElement);
      }
    }
  }

  renderDomElements() {
    const monthCalendar = document.createElement("div");
    monthCalendar.className = "month";

    const monthCalendarView = document.createElement("div");
    monthCalendarView.className = "month__view";
    monthCalendar.appendChild(monthCalendarView);

    const monthCalendarWeeks = document.createElement("div");
    monthCalendarWeeks.className = "month__weeks";
    monthCalendar.appendChild(monthCalendarWeeks);

    return { monthCalendar, monthCalendarView, monthCalendarWeeks };
  }

  addEmptyCells(grid, firstDay) {
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "month__view__grid___day-cell cell empty";
      grid.appendChild(emptyCell);
    }
  }

  addMonthDays(daysInMonth, grid, year, month) {
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "month__view__grid___day-cell cell";
      dayElement.setAttribute("data-day", day);
      const dayNumber = document.createElement("span");
      dayNumber.textContent = day;
      dayElement.appendChild(dayNumber);

      const dayDateString = this.getDateString(year, month, day);
      this.addDayEvents(dayDateString, dayElement);

      grid.appendChild(dayElement);
    }
  }

  addDayEvents(dayDateString, dayElement) {
    const eventsForDay = this.checkDayEvents(dayDateString);

    if (eventsForDay.length > 0) {
      const eventContainer = document.createElement("div");
      eventContainer.className = "month__view__grid___day-cell___event";

      eventsForDay.forEach((event) => {
        const eventTitle = document.createElement("p");
        eventTitle.textContent = event.title;
        eventContainer.appendChild(eventTitle);
      });

      dayElement.appendChild(eventContainer);
    }
  }

  render(month, year) {
    const { monthCalendar, monthCalendarView, monthCalendarWeeks } =
      this.renderDomElements();

    this.setViewName(month, year);
    this.nameWeekdays(monthCalendarView, "month");

    const grid = document.createElement("div");
    grid.className = "month__view__grid";
    monthCalendarView.appendChild(grid);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = this.getFirstDay(new Date(year, month, 1));

    this.addEmptyCells(grid, firstDay);
    this.addMonthDays(daysInMonth, grid, year, month);
    this.container.appendChild(monthCalendar);
    this.renderWeekNumbers(monthCalendarWeeks, year, month);
    this.highlightToday(grid, { month, year }, "month");
    this.highlightWeekends(grid, month, year, "month");
  }
}

export default MonthView;
