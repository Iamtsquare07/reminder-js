let reminderInterval;
const reminderInput = document.getElementById("reminderInput");
const listsContainer = document.getElementById("reminderListContainer");

function addReminder() {
  if (reminderInput.value.trim() === "") {
    alert("Please enter a reminder.");
    return;
  }

  const reminderText = reminderInput.value;
  const reminderItem = createReminderListItem(reminderText);
  const reminderList = getOrCreateReminderList(new Date());
  reminderList.appendChild(reminderItem);

  saveRemindersToLocalStorage();

  // Clear input field
  reminderInput.value = "";
}

reminderInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addReminder();
});

function createReminderListItem(reminderText) {
  // Create a new reminder list item
  const listItem = document.createElement("li");
  listItem.className = "reminderItem";

  listItem.innerHTML = `
    <span class="reminderText">${reminderText}</span>
    <button class="editReminder"><i class="fas fa-pen-square"></i> Edit</button>
    <button class="delete-reminder"><i class="fas fa-trash-alt"></i> Delete</button>
  `;

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

      remindersForDate.push({ text: reminderText });
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

window.addEventListener("beforeunload", function () {
  clearInterval(reminderInterval);
});

document.addEventListener("DOMContentLoaded", function () {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  const reminderListContainer = document.getElementById("reminderListContainer");

  reminders.forEach((reminderData) => {
    const { text } = reminderData;
    const reminderItem = createReminderListItem(text);
    const reminderList = getOrCreateReminderList(new Date());
    reminderList.appendChild(reminderItem);
  });
});
