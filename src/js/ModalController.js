class ModalController {
  constructor() {
    this.calendar = null;
  }

  setCalendar(calendar) {
    this.calendar = calendar;
  }

  addEventButtons() {
    const eventButtons = document.createElement("div");
    eventButtons.className = "modal__content__event-buttons";
    const editButton = document.createElement("button");
    editButton.innerText = "edit";
    editButton.className = "button";
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.className = "button";
    eventButtons.appendChild(editButton);
    eventButtons.appendChild(deleteButton);

    return eventButtons;
  }

  showEvents(eventsForDay, modalContent) {
    const eventsList = document.createElement("div");

    if (eventsForDay.length > 0) {
      eventsForDay.forEach((event) => {
        const eventElement = document.createElement("li");

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

        const eventButtons = this.addEventButtons();

        eventElement.appendChild(eventButtons);
        eventElement.appendChild(eventContent);
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
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete all events";
    deleteButton.className = "button";

    modalButtons.appendChild(addButton);
    if (eventsForDay.length > 0) {
      modalButtons.appendChild(deleteButton);
    }

    modal.appendChild(modalButtons);
    modal.appendChild(modalContent);

    return { modal, modalContent };
  }

  openModal(day, currentDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const selectedDate = this.calendar.getDateString(year, month, day);
    const eventsForDay = this.calendar.checkDayEvents(selectedDate);

    const { modal, modalContent } = this.renderDomElements(eventsForDay);
    this.showEvents(eventsForDay, modalContent);

    document.body.appendChild(modal);
  }

  closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) {
      modal.remove();
    }
  }
}

export default ModalController;
