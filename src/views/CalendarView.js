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
  getFirstDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  render(month, year) {
    this.clearView();
    const grid = document.createElement("div");
    grid.className = "month-view";

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = this.getFirstDay(new Date(year, month, 1));

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "day-cell";
      grid.appendChild(emptyCell);
    }

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
