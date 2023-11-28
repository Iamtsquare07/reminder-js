let reminderInterval;
const reminderInput = document.getElementById("reminderInput");

function addReminder() {
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

  const reminderData = {
    text: reminderText,
  };
  saveToLocalStorage(reminderData);

  // Clear input field
  reminderInput.value = "";
}

reminderInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addReminder();
});

function deleteReminder(reminderItem) {
  if (confirm("Are you sure you want to delete this reminder?")) {
    const reminderText = reminderItem.textContent;

    reminderItem.remove();
    removeFromLocalStorage(reminderText);
  }
}

function createReminderListItem(reminderText, reminderTime) {
  // Create a new reminder list item
  const listItem = document.createElement("li");
  const timeValue = document.createElement("span");
  timeValue.textContent = reminderTime.toString(4);
  timeValue.className = "reminderTimeValue";

  listItem.innerHTML = `
    <span class="reminderText">${reminderText}</span>
    <button class="editReminder"><i class="fas fa-pen-square"></i> Edit</button>
    <button class="delete-reminder"><i class="fas fa-trash-alt"></i> Delete</button>
  `;

  listItem.insertBefore(timeValue, listItem.firstChild);

  listItem.querySelector(".delete-reminder").addEventListener("click", () => {
    listItem.remove();
    saveRemindersToLocalStorage();
  });

  listItem.querySelector(".editReminder").addEventListener("click", () => {
    const reminderSpan = listItem.querySelector(".reminderText");
    const editedText = prompt("Edit reminder:", reminderSpan.textContent);
    if (editedText !== null) {
      reminderSpan.textContent = editedText;
      saveRemindersToLocalStorage();
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
      const reminderState = listItem.querySelector(
        ".reminderStateValue"
      ).textContent;

      remindersForDate.push({ text: reminderText, state: reminderState });
    }

    reminders[dateString] = remindersForDate;
  }

  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function getOrCreateReminderList(dateString) {
  const formattedDate = formatDate(dateString);
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
function formatDate(dateString) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
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

window.addEventListener("beforeunload", function () {
  clearInterval(reminderInterval);
});

document.addEventListener("DOMContentLoaded", function () {
  const reminderList = document.getElementById("reminderList");
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

  reminders.forEach((reminderData) => {
    const { text } = reminderData;
    const reminderItem = document.createElement("li");
    reminderItem.className = "reminderItem";

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
      deleteReminder(reminderItem);
    };

    reminderItem.innerHTML = `${text}`;
    reminderItem.appendChild(deleteBtn);

    reminderList.appendChild(reminderItem);
  });
});
