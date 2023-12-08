let reminderInterval;
let timerInitiated =
  JSON.parse(localStorage.getItem("timerInitiated")) || false;
let notCancelled = localStorage.getItem("notCancelled") || true;
localStorage.setItem("notCancelled", notCancelled);
const reminderInput = document.getElementById("reminderInput");
const listsContainer = document.getElementById("reminderList");
const alarmSound = document.getElementById("reminderSound");

function addReminder(time) {
  if (reminderInput.value.trim() === "") {
    alert("Please enter a reminder.");
    reminderInput.focus();
    return;
  }

  const reminderText = reminderInput.value;
  const reminderTimeField = document.getElementById("timePicker");
  if (reminderTimeField.value === null || reminderTimeField.value == "") {
    alert("Set a time for your reminder.");
    return;
  }
  const reminderTime = time
    ? setReminder(time)
    : reminderTimeField.value
    ? setReminder(reminderTimeField.value)
    : null;
  const reminderItem = createReminderListItem(reminderText, reminderTime);
  const reminderList = getOrCreateReminderList(new Date());
  reminderList.appendChild(reminderItem);
  setReminderTimeout(reminderTime, reminderText);
  saveRemindersToLocalStorage();

  // Clear input field
  reminderInput.value = "";
  notCancelled = true;
  localStorage.setItem("notCancelled", notCancelled);
}

reminderInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addReminder();
});

function setReminderTimeout(time, reminderContent) {
  if (timerInitiated) {
    console.log("Timer enabled");
    // Split the string based on the comma and space

    const timeDiff = computeReminderTimeout(time);
    const reminderTimeout = timeDiff;

    setTimeout(() => {
      playAlarm(reminderContent);
    }, reminderTimeout);
  } else {
    console.log("Timer not enabled");
  }
}

function computeReminderTimeout(time) {
  const returnedTime = time.split(", ");

  // Extract the time part
  const newTime = returnedTime[1];

  // Split the time part based on the colon
  const timeComponents = newTime.split(":");

  // Extract hours and minutes
  const hours = parseInt(timeComponents[0], 10);
  const minutes = parseInt(timeComponents[1], 10);

  const targetTime = new Date();
  targetTime.setHours(hours, minutes, 0, 0);
  const currentTime = new Date();
  return targetTime - currentTime;
}

function toggleTimePicker() {
  const timePickerContainer = document.getElementById("timePickerContainer");
  const switchTime = document.getElementById("switch-time");
  let selectedTime = document.getElementById("timePicker");
  if (switchTime.checked) {
    timePickerContainer.style.display = "block";
    timerInitiated = true;
    localStorage.setItem("timerInitiated", JSON.stringify(timerInitiated));
  } else {
    timePickerContainer.style.display = "none";
    selectedTime.value = null;
    timerInitiated = false;
    localStorage.setItem("timerInitiated", JSON.stringify(timerInitiated));
  }
}

function setReminder(time) {
  const trimmedTime = new Date();

  if (time.includes(":")) {
    // Parse the input time in 'hh:mm' format
    const [hours, minutes] = time.split(":").map(Number);
    trimmedTime.setHours(hours, minutes, 0, 0);
  } else {
    // Parse the input time in 'h' format (hours from now)
    const hoursFromNow = parseInt(time);
    trimmedTime.setHours(trimmedTime.getHours() + hoursFromNow);
  }

  const formattedTime = formatReminderTime(trimmedTime);
  return formattedTime;
}

function formatReminderTime(date) {
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    // If the reminder is for today
    return `Today, ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  } else {
    // If the reminder is for a future date
    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}, ${date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }
}

function createReminderListItem(reminderText, reminderTime) {
  // Create a new reminder list item
  const listItem = document.createElement("li");
  listItem.className = "reminderItem";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "taskCheckbox";

  listItem.innerHTML = `
    <div class="reminderData">
    <span class="reminderText">${reminderText}</span></div><div class="reminderButtons"><span class="reminderTime">${
    reminderTime ? reminderTime : ""
  }</span>
    
  ${
    isMobileDevice()
      ? ""
      : `<button class="editReminder"><i class="fas fa-pen-square"></i> Edit</button>`
  }
    </div>
  `;

  listItem.insertBefore(checkbox, listItem.firstChild);

  if (computeReminderTimeout(reminderTime) <= 0) {
    listItem.remove();
    saveRemindersToLocalStorage();
  }

  if (!isMobileDevice()) {
    listItem.querySelector(".editReminder").addEventListener("click", () => {
      const reminderSpan = listItem.querySelector(".reminderText");
      const editedText = prompt("Edit reminder:", reminderSpan.textContent);
      if (editedText !== null) {
        reminderSpan.textContent = editedText;
        saveRemindersToLocalStorage();
      }
    });
  }

  if (isMobileDevice()) {
    listItem.querySelector(".reminderText").addEventListener("click", () => {
      const reminderSpan = listItem.querySelector(".reminderText");
      const editedText = prompt("Edit reminder:", reminderSpan.textContent);
      if (editedText !== null) {
        reminderSpan.textContent = editedText;
        saveRemindersToLocalStorage();
      }
    });
  }

  function isMobileDevice() {
    return window.innerWidth < 768;
  }

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      listItem.querySelector(".reminderText").style.textDecoration =
        "line-through";
      listItem.remove();
      saveRemindersToLocalStorage();
      if (timerInitiated) {
        if (alarmSound.paused) {
          notCancelled = false;
          localStorage.setItem("notCancelled", notCancelled);
        } else {
          stopAlarm();
        }
      }
    }
  });

  return listItem;
}

function saveRemindersToLocalStorage() {
  const reminders = {};
  const reminderLists = listsContainer.querySelectorAll(".reminderList");

  for (const reminderList of reminderLists) {
    const formattedDate = reminderList.querySelector("h2").textContent;
    const dateString = formatDateForLocalStorage(new Date(formattedDate));

    const remindersForDate = [];
    const listItems = reminderList.querySelectorAll("li");

    for (const listItem of listItems) {
      const reminderText = listItem.querySelector(".reminderText").textContent;
      const reminderTime = listItem.querySelector(".reminderTime").textContent;

      // Store the entire reminder object with text, time, and timeout
      remindersForDate.push({
        text: reminderText,
        time: reminderTime,
      });
    }

    reminders[dateString] = remindersForDate;
  }

  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function getOrCreateReminderList(date) {
  const formattedDate = formatDate(date);
  const listId = `list-${formattedDate}`;

  // Check if a list with this date already exists
  let reminderList = document.getElementById(listId);

  if (!reminderList) {
    reminderList = document.createElement("ul");
    reminderList.id = listId;
    reminderList.className = "reminderList";

    // Create a heading for the list with the selected date
    const listHeading = document.createElement("h2");
    listHeading.textContent = formattedDate;
    reminderList.appendChild(listHeading);
    listsContainer.appendChild(reminderList);
  }

  return reminderList;
}

// Function to format the date
function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

function playAlarm(text) {
  if (localStorage.getItem("notCancelled") === "true") {
    alarmSound.play();
    const notification = document.getElementById("notifications");

    document.getElementById("reminderContent").textContent = text;
    notification.style.display = "block";
  }
}

function stopAlarm() {
  console.log("Triggering");
  const notification = document.getElementById("notifications");
  alarmSound.pause();
  notification.style.display = "none";
  notCancelled = false;
  localStorage.setItem("notCancelled", notCancelled);
  setTimeout(() => {
    renderReminders();
  }, 1000);
}

function formatDateForLocalStorage(dateString) {
  const date = new Date(dateString);
  return date.toISOString(); // Use ISO format
}

window.addEventListener("beforeunload", function () {
  clearInterval(reminderInterval);
});

function renderReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || {};
  console.log(reminders);
  // Iterate over the keys (date strings) of the reminders object
  Object.keys(reminders).forEach((dateString) => {
    const formattedDate = new Date(dateString);
    const reminderList = getOrCreateReminderList(formattedDate);

    reminders[dateString].forEach((reminderData) => {
      const { text, time } = reminderData;
      const reminderItem = createReminderListItem(text, time);
      reminderList.appendChild(reminderItem);

      if (time) {
        setTimeout(() => {
          playAlarm(text);
        }, computeReminderTimeout(time));
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderReminders();
});
