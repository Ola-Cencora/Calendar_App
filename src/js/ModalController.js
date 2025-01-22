class ModalController {
  constructor() {
    this.calendar = null;
  }

  setCalendar(calendar) {
    this.calendar = calendar;
  }

  showModal(day, currentDate) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const selectedDate = this.calendar.getDateString(year, month, day);
    const eventsForDay = this.calendar.checkDayEvents(selectedDate);

    const modal = document.createElement("div");
    modal.className = "modal";
    let eventsHtml = "<ul>";

    if (eventsForDay.length > 0) {
      eventsForDay.forEach((event) => {
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

        eventsHtml += `
          <li>
          <strong>${event.title}</strong><br />
          ${formattedDate} &#x2022; ${startTime} - ${endTime}<br />
          ${event.description}<br />
          ${event.userId ? "User  " + event.userId : ""}
          </li>        
          `;
      });
    } else {
      eventsHtml = `<p>No events for this day</p>`;
    }
    eventsHtml += "</ul>";

    modal.innerHTML = `
      <div class="modal__content">
        ${eventsHtml}
      </div>
    `;
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
