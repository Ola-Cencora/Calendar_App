class CalendarView {
  constructor(container) {
    this.container = container;
    this.clearView();
  }

  clearView() {
    this.container.innerHTML = "";
  }

  setViewName(month, year) {
    const viewNameHeading = document.createElement("h2");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthName = monthNames[month];

    viewNameHeading.textContent = `${monthName} ${year}`;
    viewNameHeading.classList.add("viewName");
    this.container.appendChild(viewNameHeading);
  }

  highlightToday(container, currentDate) {
    const today = new Date();
    if (
      today.getFullYear() === currentDate.year &&
      today.getMonth() === currentDate.month
    ) {
      const dayCells = container.querySelectorAll(".day-cell");
      const todayNumber = today.getDate();
      dayCells.forEach((cell) => {
        if (parseInt(cell.textContent, 10) === todayNumber) {
          cell.classList.add("today");
        }
      });
    }
  }

  highlightWeekends(container, month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayCells = container.querySelectorAll(".day-cell");

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = new Date(year, month, day).getDay();

      if (dayOfWeek === 1 || dayOfWeek === 0) {
        dayCells[day].classList.add("weekend");
      }
    }
  }

  nameWeekdays(wrapper) {
    const weekdaysContainer = document.createElement("div");
    weekdaysContainer.className = "weekdays";

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach((day) => {
      const weekday = document.createElement("div");
      weekday.textContent = day;
      weekdaysContainer.appendChild(weekday);
    });

    wrapper.appendChild(weekdaysContainer);
  }
}

export class YearView extends CalendarView {}

export class MonthView extends CalendarView {
  getFirstDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  renderWeekNumbers(calendarInnerWeeks, year, month) {
    function getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return [d.getUTCFullYear(), weekNo];
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, daysInMonth);

    const firstWeekNumber = getWeekNumber(firstDay)[1];
    const lastWeekNumber = getWeekNumber(lastDay)[1];

    for (let i = firstWeekNumber; i <= lastWeekNumber; i++) {
      const weekNumberElement = document.createElement("div");
      weekNumberElement.className = "week-number";
      weekNumberElement.textContent = i;
      calendarInnerWeeks.appendChild(weekNumberElement);
    }
  }

  renderDomElements() {
    const calendarInner = document.createElement("div");
    calendarInner.className = "calendar__inner";

    const calendarInnerView = document.createElement("div");
    calendarInnerView.className = "calendar__inner___view";
    calendarInner.appendChild(calendarInnerView);

    const calendarInnerWeeks = document.createElement("div");
    calendarInnerWeeks.className = "calendar__inner___weeks";
    calendarInnerWeeks.innerText = "week";
    calendarInner.appendChild(calendarInnerWeeks);

    return { calendarInner, calendarInnerView, calendarInnerWeeks };
  }

  render(month, year) {
    const { calendarInner, calendarInnerView, calendarInnerWeeks } =
      this.renderDomElements();

    this.setViewName(month, year);
    this.nameWeekdays(calendarInnerView);

    const grid = document.createElement("div");
    grid.className = "month-view";
    calendarInnerView.appendChild(grid);

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

    this.container.appendChild(calendarInner);

    this.renderWeekNumbers(calendarInnerWeeks, year, month);
    this.highlightToday(grid, { month, year });
    this.highlightWeekends(grid, month, year);
  }
}

export class WeekView extends CalendarView {}

export class DayView extends CalendarView {}
