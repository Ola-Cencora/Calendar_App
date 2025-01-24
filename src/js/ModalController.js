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

  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  openEventForm(eventData = null, selectedDate) {
    const modalContent = document.querySelector(".modal__content");
    if (!modalContent) return;

    modalContent.innerHTML = "";

    const form = document.createElement("form");
    form.className = "event-form";

    const selectedDateTime = new Date(selectedDate).toISOString().slice(0, 16);
    const selectedDateString = this.formatDate(selectedDateTime);

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const isAllDayEvent =
      eventData &&
      eventData.startDate &&
      eventData.endDate &&
      eventData.startDate.slice(11, 19) === "00:00:00" &&
      eventData.endDate.slice(11, 19) === "23:59:59";

    form.innerHTML = `
    <label>
      Title:
      <input type="text" name="title" value="${
        eventData?.title || ""
      }" required />
    </label>
    <label>
      Description:
      <textarea name="description" required>${
        eventData?.description || ""
      }</textarea>
    </label>
    <label>
      Date:
      <input type="date" name="date" value="${
        eventData
          ? this.formatDate(new Date(eventData.startDate))
          : selectedDateString
      }" required />
    </label>
    <label>
      <input type="checkbox" name="allDay" ${isAllDayEvent ? "checked" : ""} />
      All Day Event
    </label>
    <label>
      Start Time:
      <input type="time" name="startTime" value="${
        isAllDayEvent
          ? "00:00"
          : eventData
          ? formatTime(new Date(eventData.startDate))
          : formatTime(new Date(selectedDate))
      }" ${isAllDayEvent ? "disabled" : ""} required />
    </label>
    <label>
      End Time:
      <input type="time" name="endTime" value="${
        isAllDayEvent
          ? "23:59"
          : eventData
          ? formatTime(new Date(eventData.endDate))
          : formatTime(new Date(selectedDate))
      }" ${isAllDayEvent ? "disabled" : ""} required />
    </label>
    <button type="submit" class="button">${
      eventData ? "Save Changes" : "Add Event"
    }</button>
    <button class="button" id="cancel-button">Cancel</button>
  `;

    modalContent.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const newEvent = {
        title: formData.get("title"),
        description: formData.get("description"),
        startDate:
          formData.get("date") +
          "T" +
          (formData.get("allDay") === "on"
            ? "00:00"
            : formData.get("startTime")) +
          ":00",
        endDate:
          formData.get("date") +
          "T" +
          (formData.get("allDay") === "on"
            ? "23:59"
            : formData.get("endTime")) +
          ":59",
      };

      if (eventData) {
        this.backendService.updateEvent(eventData.id, selectedDate, newEvent);
      } else {
        this.backendService.addEvent(
          this.formatDate(newEvent.startDate),
          newEvent
        );
      }

      this.updateAll(selectedDate);
    });

    document.querySelector("#cancel-button").addEventListener("click", () => {
      this.updateModal(selectedDate);
    });
  }

  attachEventListeners(selectedDate) {
    document.querySelector("#add-button").addEventListener("click", () => {
      this.openEventForm(null, selectedDate);
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
        const eventData = this.backendService.getEventById(eventId);
        this.openEventForm(eventData, selectedDate);
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
