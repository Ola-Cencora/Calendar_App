class ModalController {
  constructor(backendService, calendarView) {
    this.backendService = backendService;
    this.calendarView = calendarView;
    this.calendar = null;
  }

  setCalendar(calendar) {
    this.calendar = calendar;
  }

  updateModal(selectedDate) {
    const modal = document.querySelector(".modal");
    const modalContent = modal?.querySelector(".modal__content");

    const eventsForDay = this.calendar.checkDayEvents(selectedDate);

    if (modal && modalContent) {
      modalContent.innerHTML = "";
      this.showEvents(eventsForDay, modalContent);
      this.attachEventListeners(selectedDate);
    }
  }

  updateAll(selectedDate) {
    this.updateModal(selectedDate);
    this.calendarView.renderView();
  }

  addEventButtons(eventId) {
    const eventButtons = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.innerText = "edit";
    editButton.className = "button";
    editButton.setAttribute("id", "edit-button");
    editButton.setAttribute("data-id", eventId);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.className = "button";
    deleteButton.setAttribute("data-id", eventId);
    deleteButton.setAttribute("id", "delete-button");

    eventButtons.appendChild(editButton);
    eventButtons.appendChild(deleteButton);

    return eventButtons;
  }

  showEvents(eventsForDay, modalContent) {
    const eventsList = document.createElement("ul");
    eventsList.className = "modal__content__list";

    if (eventsForDay.length > 0) {
      eventsForDay.forEach((event) => {
        const eventElement = document.createElement("li");
        eventElement.className = "modal__content__list___event";

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

        const eventContent = document.createElement("div");
        eventContent.innerHTML = `
        <strong>${event.title}</strong><br />
        ${formattedDate} &#x2022; ${startTime} - ${endTime}<br />
        ${event.description}<br />
        ${event.userId ? "User " + event.userId : ""}
      `;

        const eventButtons = this.addEventButtons(event.id);

        eventElement.appendChild(eventContent);
        eventElement.appendChild(eventButtons);
        eventsList.appendChild(eventElement);
      });
    } else {
      const noEventsMessage = document.createElement("p");
      noEventsMessage.textContent = "No events";
      eventsList.appendChild(noEventsMessage);
    }

    modalContent.appendChild(eventsList);
  }

  renderDomElements(eventsForDay) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal__content";

    const modalButtons = document.createElement("div");
    modalButtons.className = "modal__buttons";
    const addButton = document.createElement("button");
    addButton.innerText = "add event";
    addButton.className = "button";
    addButton.setAttribute("id", "add-button");
    const deleteAllButton = document.createElement("button");
    deleteAllButton.innerText = "delete all";
    deleteAllButton.className = "button";
    deleteAllButton.setAttribute("id", "delete-all-button");

    modalButtons.appendChild(addButton);
    if (eventsForDay.length > 0) {
      modalButtons.appendChild(deleteAllButton);
    }

    modal.appendChild(modalButtons);
    modal.appendChild(modalContent);

    return { modal, modalContent };
  }

  attachEventListeners(selectedDate) {
    document.querySelector("#add-button").addEventListener("click", () => {
      console.log("add button");
    });

    const deleteAllButton = document.querySelector("#delete-all-button");
    if (deleteAllButton)
      deleteAllButton.addEventListener("click", () => {
        this.backendService.deleteAllEvents(selectedDate);
        this.updateAll(selectedDate);
      });

    document.querySelectorAll("#edit-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const eventId = e.target.getAttribute("data-id");
        console.log("edit button", eventId);
      });
    });

    document.querySelectorAll("#delete-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const eventId = e.target.getAttribute("data-id");
        this.backendService.deleteEvent(eventId, selectedDate);
        this.updateAll(selectedDate);
      });
    });
  }

  openModal(day, currentDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const selectedDate = this.calendar.getDateString(year, month, day);
    const eventsForDay = this.calendar.checkDayEvents(selectedDate);

    const { modal, modalContent } = this.renderDomElements(eventsForDay);
    this.showEvents(eventsForDay, modalContent);

    document.body.appendChild(modal);
    this.attachEventListeners(selectedDate);
  }

  closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  }
}

export default ModalController;
