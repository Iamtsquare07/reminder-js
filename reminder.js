let reminderInterval;

function addReminder() {
  const reminderInput = document.getElementById("reminderInput");
  const reminderList = document.getElementById("reminderList");

  if (reminderInput.value.trim() === "") {
    alert("Please enter a reminder.");
    return;
  }

  const reminderText = reminderInput.value;
  const reminderItem = document.createElement("li");
  reminderItem.className = "reminderItem";

  const deleteBtn = document.createElement("span");
  deleteBtn.className = "deleteBtn";
  deleteBtn.innerText = "Delete";
  deleteBtn.onclick = function () {
    deleteReminder(reminderItem);
  };

  reminderItem.innerHTML = `${reminderText}`;
  reminderItem.appendChild(deleteBtn);

  reminderList.appendChild(reminderItem);

  // Save to localStorage
  const reminderData = {
    text: reminderText,
    time: "", // Placeholder for time when not specified initially
  };
  saveToLocalStorage(reminderData);

  // Clear input field
  reminderInput.value = "";
}


function deleteReminder(reminderItem) {
  if (confirm("Are you sure you want to delete this reminder?")) {
    // Extract the text and time from the reminder item
    const [reminderText, reminderTime] = reminderItem.textContent.split(" - ");

    // Remove from the UI
    reminderItem.remove();

    // Remove from localStorage
    removeFromLocalStorage(reminderText);

    // If there is a reminder time, remove the reminder from localStorage based on the new structure
    if (reminderTime) {
      removeFromLocalStorage(reminderText);
    }
  }
}

function saveToLocalStorage(reminderData) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.push(reminderData);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function removeFromLocalStorage(reminderText) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders = reminders.filter((item) => item.text !== reminderText);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function setReminder(defaultTime) {
  const timePicker = document.getElementById("timePicker");
  const reminderList = document.getElementById("reminderList");

  let reminderTime;

  if (document.getElementById("switch-time").checked) {
    // Use the selected time from the time picker
    reminderTime = timePicker.value;
  } else {
    // Use the default time suggestion
    reminderTime = defaultTime;
  }

  const reminderInput = document.getElementById("reminderInput");

  if (reminderInput.value.trim() === "") {
    alert("Please enter a reminder.");
    return;
  }

  const reminderText = reminderInput.value;
  const reminderItem = document.createElement("li");
  reminderItem.className = "reminderItem";

  const deleteBtn = document.createElement("span");
  deleteBtn.className = "deleteBtn";
  deleteBtn.innerText = "Delete";
  deleteBtn.onclick = function () {
    deleteReminder(reminderItem);
  };

  reminderItem.innerHTML = `${reminderText} - ${reminderTime}`;
  reminderItem.appendChild(deleteBtn);

  reminderList.appendChild(reminderItem);

  // Save to localStorage
  const reminderData = {
    text: reminderText,
    time: reminderTime,
  };
  saveToLocalStorage(reminderData);

  // Clear input field
  reminderInput.value = "";

  // Start the reminder interval if it's the first reminder
  if (!reminderInterval) {
    reminderInterval = setInterval(checkReminders, 60000); // Check every minute
  }
}

function checkReminders() {
  const currentTimestamp = new Date().getTime();
  const reminderList = document.getElementById("reminderList");
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  reminders.forEach((reminderData) => {
    const { text, time } = reminderData;
    const reminderTime = new Date(time).getTime();

    if (currentTimestamp >= reminderTime) {
      // The reminder time has elapsed
      alert(`Reminder: ${text}`);
      // Remove from the UI
      removeReminderFromUI(text);
      // Remove from localStorage
      removeReminderFromLocalStorage(text);
    }
  });
}

function removeReminderFromUI(reminderText) {
  const reminderList = document.getElementById("reminderList");
  const reminderItems = reminderList.getElementsByClassName("reminderItem");

  for (let i = 0; i < reminderItems.length; i++) {
    const reminderItemText = reminderItems[i].textContent.split(" - ")[0];
    if (reminderItemText === reminderText) {
      reminderItems[i].remove();
      break;
    }
  }
}

function removeReminderFromLocalStorage(reminderText) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders = reminders.filter((item) => item.text !== reminderText);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function toggleTimePicker() {
  const timePickerContainer = document.getElementById("timePickerContainer");
  const switchTime = document.getElementById("switch-time");

  if (switchTime.checked) {
    timePickerContainer.style.display = "block";
  } else {
    timePickerContainer.style.display = "none";
  }
}

window.addEventListener("beforeunload", function () {
  clearInterval(reminderInterval);
});

document.addEventListener("DOMContentLoaded", function () {
  const reminderList = document.getElementById("reminderList");
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  reminders.forEach((reminderData) => {
    const { text, time } = reminderData;
    const reminderItem = document.createElement("li");
    reminderItem.className = "reminderItem";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
      deleteReminder(reminderItem);
    };

    reminderItem.innerHTML = `${text} ${time ? "-": ""} ${time} `;
    reminderItem.appendChild(deleteBtn);

    reminderList.appendChild(reminderItem);
  });
});
