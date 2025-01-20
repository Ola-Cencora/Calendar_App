import CalendarView from "./CalendarView";

class YearView extends CalendarView {
  renderDomElements() {
    const yearCalendar = document.createElement("div");
    yearCalendar.className = "year";

    const yearCalendarView = document.createElement("div");
    yearCalendarView.className = "year__view";

    return { yearCalendar, yearCalendarView };
  }

  render(year) {
    const { yearCalendar, yearCalendarView } = this.renderDomElements();

    this.setViewName("", year);
  }
}

export default YearView;
