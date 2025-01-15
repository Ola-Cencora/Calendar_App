class CalendarView {
  constructor(container) {
    this.container = container;
    this.clearView();
  }

  clearView() {
    this.container.innerHTML = "";
  }

  setViewName(month, year) {
    const calendarHeading = document.querySelector(".calendar__heading__h2");
    let viewNameHeading = calendarHeading.querySelector(".viewName");

    if (!viewNameHeading) {
      viewNameHeading = document.createElement("h2");
      viewNameHeading.classList.add("viewName");
      calendarHeading.appendChild(viewNameHeading);
    }

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
    viewNameHeading.innerText = `${monthName} ${year}`;
  }

  highlightToday(container, currentDate) {
    const today = new Date();
    if (
      today.getFullYear() === currentDate.year &&
      today.getMonth() === currentDate.month
    ) {
      const dayCells = container.querySelectorAll(
        ".month__view__grid___day-cell"
      );
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
    const dayCells = container.querySelectorAll(
      ".month__view__grid___day-cell"
    );

    const firstDay = this.getFirstDay(new Date(year, month, 1));

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = new Date(year, month, day).getDay();

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        const cellIndex = firstDay + day - 1;
        dayCells[cellIndex].classList.add("weekend");
      }
    }
  }

  nameWeekdays(wrapper) {
    const weekdaysContainer = document.createElement("div");
    weekdaysContainer.className = "month__view__weekdays";

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

  renderWeekNumbers(monthCalendarWeeks, year, month) {
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
      weekNumberElement.textContent = `week ${i}`;
      monthCalendarWeeks.appendChild(weekNumberElement);
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

  render(month, year) {
    const { monthCalendar, monthCalendarView, monthCalendarWeeks } =
      this.renderDomElements();

    this.setViewName(month, year);
    this.nameWeekdays(monthCalendarView);

    const grid = document.createElement("div");
    grid.className = "month__view__grid";
    monthCalendarView.appendChild(grid);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = this.getFirstDay(new Date(year, month, 1));

    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "month__view__grid___day-cell cell";
      grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "month__view__grid___day-cell cell";
      dayElement.textContent = day;
      grid.appendChild(dayElement);
    }

    this.container.appendChild(monthCalendar);

    this.renderWeekNumbers(monthCalendarWeeks, year, month);
    this.highlightToday(grid, { month, year });
    this.highlightWeekends(grid, month, year);
  }
}

export class WeekView extends CalendarView {}

export class DayView extends CalendarView {}
