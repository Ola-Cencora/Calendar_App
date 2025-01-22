import CalendarView from "./CalendarView";

class DayView extends CalendarView {
  addDayEvents(dayDateString, dayCalendarDay) {
    const eventsForDay = this.checkDayEvents(dayDateString);

    if (eventsForDay.length > 0) {
      const eventContainer = document.createElement("div");
      eventContainer.className = `day__view___day__event-container`;

      eventsForDay.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.className = `day__view___day__event-container___event`;

        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);

        const startTime = startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = endDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (startDate.getHours() === 0 && endDate.getHours() === 23) {
          eventElement.innerHTML = event.title;

          eventElement.style.position = "relative";
          eventElement.style.height = "40px";
          eventElement.style.top = "0";
          eventElement.style.textTransform = "uppercase";
        } else {
          eventElement.innerHTML = `${event.title} <br> ${startTime} - ${endTime}`;

          const eventDurationInMinutes = (endDate - startDate) / 60000;
          const eventStartOffsetInMinutes =
            startDate.getHours() * 60 + startDate.getMinutes() - 5 * 60;

          const topOffset = (eventStartOffsetInMinutes / (18 * 60)) * 600;
          const height = (eventDurationInMinutes / (18 * 60)) * 600;

          eventElement.style.top = `${topOffset}px`;
          eventElement.style.height = `${height}px`;
        }

        eventContainer.appendChild(eventElement);
      });

      dayCalendarDay.appendChild(eventContainer);
    }
  }

  renderDomElements(day) {
    const dayCalendar = document.createElement("div");
    dayCalendar.className = "day";

    const dayCalendarView = document.createElement("div");
    dayCalendarView.className = "day__view";
    dayCalendar.appendChild(dayCalendarView);

    const dayCalendarTime = document.createElement("div");
    dayCalendarTime.className = "day__view___time";
    dayCalendarView.appendChild(dayCalendarTime);

    const dayCalendarDay = document.createElement("div");
    dayCalendarDay.className = "day__view___day";
    dayCalendarDay.setAttribute("data-day", day);
    dayCalendarView.appendChild(dayCalendarDay);

    return { dayCalendar, dayCalendarTime, dayCalendarDay };
  }

  render(month, year, currentDate) {
    const day = currentDate.getDate();

    const { dayCalendar, dayCalendarTime, dayCalendarDay } =
      this.renderDomElements(day);

    this.setViewName(month, year, `${day}, `);
    this.addTime(dayCalendarTime, "day");
    this.container.appendChild(dayCalendar);

    const dayDateString = this.getDateString(year, month, day);
    this.addDayEvents(dayDateString, dayCalendarDay);
  }
}

export default DayView;
