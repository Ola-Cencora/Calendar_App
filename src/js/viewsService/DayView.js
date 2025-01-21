import CalendarView from "./CalendarView";

class DayView extends CalendarView {
  renderDomElements() {
    const dayCalendar = document.createElement("div");
    dayCalendar.className = "day";

    return { dayCalendar };
  }

  render(month, year, currentDate) {
    const { dayCalendar } = this.renderDomElements();

    const day = currentDate.getDate();

    this.setViewName(month, year, `${day}, `);
    this.container.appendChild(dayCalendar);
  }
}

export default DayView;
