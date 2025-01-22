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

  getMonthName(monthIndex) {
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
    return monthNames[monthIndex];
  }

  setViewName(month, year, day = "") {
    const calendarHeading = document.querySelector(".calendar__heading__h2");
    let viewNameHeading = calendarHeading.querySelector(".viewName");

    if (!viewNameHeading) {
      viewNameHeading = document.createElement("h2");
      viewNameHeading.classList.add("viewName");
      calendarHeading.appendChild(viewNameHeading);
    }

    const monthName = this.getMonthName(month);
    viewNameHeading.innerText = `${
      month === "" ? `${year}` : `${monthName} ${day} ${year}`
    }`;
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

    view === "year"
      ? (weekdaysContainer.className = `${view}__month__weekdays`)
      : (weekdaysContainer.className = `${view}__view__weekdays`);

    let weekdays = [];
    view === "year"
      ? (weekdays = ["M", "T", "W", "T", "F", "S", "S"])
      : (weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

    weekdays.forEach((day) => {
      const weekday = document.createElement("div");
      weekday.textContent = day;
      weekdaysContainer.appendChild(weekday);
    });

    wrapper.appendChild(weekdaysContainer);
  }

  // tej metody używa tylko MonthView
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

  getFirstDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  addTime(container, view) {
    for (let hour = 5; hour < 23; hour++) {
      const timeSlot = document.createElement("div");
      view === "week"
        ? (timeSlot.className = "week__time___slot")
        : (timeSlot.className = "day__view___time___slot");

      const formattedHour = hour.toString().padStart(2, "0") + ":00";
      timeSlot.textContent = formattedHour;

      container.appendChild(timeSlot);
    }
  }
}

export default CalendarView;
