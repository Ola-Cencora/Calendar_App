import CalendarView from "./CalendarView";

class DayView extends CalendarView {
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

    return { dayCalendar, dayCalendarTime };
  }

  render(month, year, currentDate) {
    const day = currentDate.getDate();

    const { dayCalendar, dayCalendarTime } = this.renderDomElements(day);

    this.setViewName(month, year, `${day}, `);
    this.addTime(dayCalendarTime, "day");
    this.container.appendChild(dayCalendar);
  }
}

export default DayView;
