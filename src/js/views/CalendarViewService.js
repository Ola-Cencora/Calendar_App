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

  showModal(day, currentDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const selectedDate = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
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
      emptyCell.className = "month__view__grid___day-cell cell empty";
      grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.className = "month__view__grid___day-cell cell";
      dayElement.setAttribute("data-day", day);
      const dayNumber = document.createElement("span");
      dayNumber.textContent = day;
      dayElement.appendChild(dayNumber);

      const dayDateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

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
