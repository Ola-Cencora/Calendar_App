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

  getFirstDay(date) {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  }

  addTime(container, view) {
    for (let hour = 5; hour < 23; hour++) {
      const timeSlot = document.createElement("div");
      view === "week"
        ? (timeSlot.className = "week__time___slot")
        : (timeSlot.className = "day__time___slot");

      const formattedHour = hour.toString().padStart(2, "0") + ":00";
      timeSlot.textContent = formattedHour;

      container.appendChild(timeSlot);
    }
  }
}

export default CalendarView;
