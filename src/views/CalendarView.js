class CalendarView {
  constructor(container) {
    this.container = container;
  }

  clearView() {
    this.container.innerHTML = "";
  }
}

export class YearView extends CalendarView {}

export class MonthView extends CalendarView {
  render(month, year) {
    this.clearView();
    const grid = document.createElement("div");
    grid.className = "month-view";

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day-cell";
      dayElement.textContent = day;
      grid.appendChild(dayElement);
    }

    this.container.appendChild(grid);
  }
}

export class WeekView extends CalendarView {}

export class DayView extends CalendarView {}
