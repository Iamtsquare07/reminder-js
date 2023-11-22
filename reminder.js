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
  saveToLocalStorage(reminderText);

  // Clear input field
  reminderInput.value = "";
}

function deleteReminder(reminderItem) {
  if (confirm("Are you sure you want to delete this reminder?")) {
    // Remove from the UI
    reminderItem.remove();

    // Remove from localStorage
    removeFromLocalStorage(reminderItem.firstChild.nodeValue);
  }
}

function saveToLocalStorage(reminder) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function removeFromLocalStorage(reminder) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders = reminders.filter((item) => item !== reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

// Load reminders from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  const reminderList = document.getElementById("reminderList");
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  reminders.forEach((reminder) => {
    const reminderItem = document.createElement("li");
    reminderItem.className = "reminderItem";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
      deleteReminder(reminderItem);
    };

    reminderItem.innerHTML = `${reminder}`;
    reminderItem.appendChild(deleteBtn);

    reminderList.appendChild(reminderItem);
  });
});

// Add this function to your script
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
  saveToLocalStorage(`${reminderText} - ${reminderTime}`);

  // Clear input field
  reminderInput.value = "";

  // Hide the time picker container
  document.getElementById("timePickerContainer").style.display = "none";
}

// Modify the existing function to toggle the time picker container
function toggleTimePicker() {
  const timePickerContainer = document.getElementById("timePickerContainer");
  const switchTime = document.getElementById("switch-time");

  if (switchTime.checked) {
    timePickerContainer.style.display = "block";
  } else {
    timePickerContainer.style.display = "none";
  }
}
