class CalendarView {
  constructor(container, events) {
    this.container = container;
    this.calendarEvents = events;
    this.clearView();
  }

  clearView() {
    this.container.innerHTML = "";
  }

  checkDayEvents(selectedDate) {
    const dayData = this.calendarEvents.find(
      (day) => day.date === selectedDate
    );
    const eventsForDay = dayData ? dayData.events : [];
    return eventsForDay;
  }

  getDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  showModal(day, currentDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const selectedDate = this.getDateString(year, month, day);
    const eventsForDay = this.checkDayEvents(selectedDate);

    const modal = document.createElement("div");
    modal.className = "modal";
    let eventsHtml = "<ul>";

    if (eventsForDay.length > 0) {
      eventsForDay.forEach((event) => {
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        const options = {
          weekday: "long",
          month: "long",
          day: "numeric",
        };
        const formattedDate = startDate.toLocaleDateString("en-US", options);

        const startTime = startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = endDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });

        eventsHtml += `
          <li>
          <strong>${event.title}</strong><br />
          ${formattedDate} &#x2022; ${startTime} - ${endTime}<br />
          ${event.description}<br />
          ${event.userId ? "User  " + event.userId : ""}
          </li>        
          `;
      });
    } else {
      eventsHtml = `<p>No events for this day</p>`;
    }
    eventsHtml += "</ul>";

    modal.innerHTML = `
      <div class="modal__content">
        ${eventsHtml}
      </div>
    `;
    document.body.appendChild(modal);
  }

  closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
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

  highlightToday(container, currentDate, view) {
    const today = new Date();
    if (
      today.getFullYear() === currentDate.year &&
      today.getMonth() === currentDate.month
    ) {
      const dayCells = container.querySelectorAll(
        `.${view}__view__grid___day-cell`
      );
      const todayNumber = today.getDate();
      dayCells.forEach((cell) => {
        if (parseInt(cell.textContent, 10) === todayNumber) {
          cell.classList.add("today");
        }
      });
    }
  }

  highlightWeekends(container, month, year, view) {
    const dayCells = container.querySelectorAll(
      `.${view}__view__grid___day-cell`
    );

    if (view === "week") {
      dayCells.forEach((cell, index) => {
        const dayOfWeek = (index + 1) % 7;
        if (dayOfWeek === 6 || dayOfWeek === 0) {
          cell.classList.add("weekend");
        }
      });
    } else {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = this.getFirstDay(new Date(year, month, 1));

      for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(year, month, day).getDay();

        if (dayOfWeek === 6 || dayOfWeek === 0) {
          const cellIndex = firstDay + day - 1;
          dayCells[cellIndex].classList.add("weekend");
        }
      }
    }
  }

  nameWeekdays(wrapper, view) {
    const weekdaysContainer = document.createElement("div");
    weekdaysContainer.className = `${view}__view__weekdays`;

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach((day) => {
      const weekday = document.createElement("div");
      weekday.textContent = day;
      weekdaysContainer.appendChild(weekday);
    });

    wrapper.appendChild(weekdaysContainer);
  }

  addDayEvents(dayDateString, dayElement, view) {
    const eventsForDay = this.checkDayEvents(dayDateString);

    if (eventsForDay.length > 0) {
      const eventContainer = document.createElement("div");
      eventContainer.className = `${view}__view__grid___day-cell___event`;

      eventsForDay.forEach((event) => {
        const eventTitle = document.createElement("p");
        eventTitle.textContent = event.title;
        eventContainer.appendChild(eventTitle);
      });

      dayElement.appendChild(eventContainer);
    }
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
      this.addDayEvents(dayDateString, dayElement, "month");

      grid.appendChild(dayElement);
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

export class WeekView extends CalendarView {
  renderDomElements() {
    const weekCalendar = document.createElement("div");
    weekCalendar.className = "week";

    const weekCalendarView = document.createElement("div");
    weekCalendarView.className = "week__view";
    weekCalendar.appendChild(weekCalendarView);

    return { weekCalendar, weekCalendarView };
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
    const { weekCalendar, weekCalendarView } = this.renderDomElements();
    this.setViewName(month, year);
    this.nameWeekdays(weekCalendarView, "week");

    const startOfWeek = this.getStartOfWeek(currentDate);

    const grid = document.createElement("div");
    grid.className = "week__view__grid";
    weekCalendarView.appendChild(grid);

    this.addWeekDays(startOfWeek, grid);
    this.container.appendChild(weekCalendar);
    this.highlightToday(grid, { month, year }, "week");
    this.highlightWeekends(grid, month, year, "week");
  }
}

export class DayView extends CalendarView {}
