import YearView from "./viewsService/YearView";
import MonthView from "./viewsService/MonthView";
import WeekView from "./viewsService/WeekView";
import DayView from "./viewsService/DayView";
import ModalController from "./ModalController";

export class CalendarViewController {
  constructor(container, backendService, events) {
    this.container = container;
    this.calendarEvents = events;
    this.backendService = backendService;
    this.currentDate = new Date();
    this.modal = new ModalController(backendService, this);
    this.view = "month";
    this.backendService.onDataUpdate = (updatedEvents) => {
      this.calendarEvents = updatedEvents;
      this.renderView();
    };
    this.init();
  }

  init() {
    this.renderView();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const viewButtons = document.querySelector(".header__viewBtns");
    viewButtons.addEventListener("click", (e) => this.handleViewChange(e));

    const navigationButtons = document.querySelector(".calendar__heading");
    navigationButtons.addEventListener("click", (e) =>
      this.handleNavigation(e)
    );

    document.addEventListener("click", (e) => this.handleToggleModal(e));
  }

  handleToggleModal(event) {
    const target = event.target;

    const dayCell = target.closest(
      ".month__view__grid___day-cell, .week__view__grid___day-cell, .day__view"
    );

    if (dayCell && !dayCell.classList.contains("empty")) {
      const day = dayCell.getAttribute("data-day");
      this.modal.openModal(day, this.currentDate);
      return;
    }

    if (target.classList.contains("modal")) {
      this.modal.closeModal();
      return;
    }
  }

  handleViewChange(event) {
    const target = event.target;
    if (!target.dataset.view) return;

    const buttons = target.parentNode.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    target.classList.add("active");

    this.view = target.dataset.view;
    this.renderView();
  }

  handleNavigation(event) {
    const target = event.target;
    if (!target.dataset.action) return;

    switch (target.dataset.action) {
      case "next":
        this.incrementDate();
        break;
      case "prev":
        this.decrementDate();
        break;
    }

    this.renderView();
  }

  incrementDate() {
    switch (this.view) {
      case "year":
        this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        break;
      case "month":
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
      case "week":
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        break;
      case "day":
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        break;
    }
  }

  decrementDate() {
    switch (this.view) {
      case "year":
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        break;
      case "month":
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
      case "week":
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        break;
      case "day":
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        break;
    }
  }

  renderView() {
    const { year, month } = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth(),
    };

    switch (this.view) {
      case "year":
        this.viewInstance = new YearView(this.container);
        this.viewInstance.render(year, this.currentDate);
        break;
      case "month":
        this.viewInstance = new MonthView(this.container, this.calendarEvents);
        this.viewInstance.render(month, year);
        break;
      case "week":
        this.viewInstance = new WeekView(this.container, this.calendarEvents);
        this.viewInstance.render(month, year, this.currentDate);
        break;
      case "day":
        this.viewInstance = new DayView(this.container, this.calendarEvents);
        this.viewInstance.render(month, year, this.currentDate);
        break;
    }

    this.modal.setCalendar(this.viewInstance);
  }
}
