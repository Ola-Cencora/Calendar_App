import CalendarView from "./CalendarView";

class DayView extends CalendarView {
  addTime(dayCalendarTime) {
    for (let hour = 5; hour < 23; hour++) {
      const timeSlot = document.createElement("div");
      timeSlot.className = "day__view___time___slot";

      const formattedHour = hour.toString().padStart(2, "0") + ":00";
      timeSlot.textContent = formattedHour;

      dayCalendarTime.appendChild(timeSlot);
    }
  }

  renderDomElements() {
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
    dayCalendarView.appendChild(dayCalendarDay);

    return { dayCalendar, dayCalendarTime };
  }

  render(month, year, currentDate) {
    const { dayCalendar, dayCalendarTime } = this.renderDomElements();

    const day = currentDate.getDate();

    this.setViewName(month, year, `${day}, `);
    this.addTime(dayCalendarTime);
    this.container.appendChild(dayCalendar);
  }
}

export default DayView;
