import CalendarView from "./CalendarView";

class YearView extends CalendarView {
  renderDomElements() {
    const yearCalendar = document.createElement("div");
    yearCalendar.className = "year";

    return { yearCalendar };
  }

  addMonthDays(grid, year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "year__month__grid___day-cell";
      const dayNumber = document.createElement("span");
      dayNumber.textContent = day;
      dayElement.appendChild(dayNumber);

      grid.appendChild(dayElement);
    }
  }

  renderMonths(yearCalendar, year) {
    for (let month = 0; month < 12; month++) {
      const monthCalendar = document.createElement("div");
      monthCalendar.className = "year__month";

      const monthName = document.createElement("p");
      monthName.className = "year__month__name";
      monthName.textContent = this.getMonthName(month);
      monthCalendar.appendChild(monthName);

      const monthGrid = document.createElement("div");
      monthGrid.className = "year__month__grid";
      monthCalendar.appendChild(monthGrid);

      const firstDay = this.getFirstDay(new Date(year, month, 1));
      for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "year__month__grid___day-cell empty";
        monthGrid.appendChild(emptyCell);
      }

      this.nameWeekdays(monthCalendar, "year");
      this.addMonthDays(monthGrid, year, month);

      yearCalendar.appendChild(monthCalendar);
    }
  }

  render(year) {
    const { yearCalendar } = this.renderDomElements();

    this.setViewName("", year);
    this.renderMonths(yearCalendar, year);
    this.container.appendChild(yearCalendar);
  }
}

export default YearView;
