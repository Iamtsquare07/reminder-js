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
    text: `${reminderText}`,
    time: `${reminderTime}`,
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

    reminderItem.innerHTML = `${text} - ${time}`;
    reminderItem.appendChild(deleteBtn);

    reminderList.appendChild(reminderItem);
  });
});

// User Geo Location
function detectUserCountry(country) {
  const apiUrl = "https://ipapi.co/json/";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {

      if (country === "NG") {
        if (window.location.href !== "https://www.sonhosting.com") {
          window.location.replace("https://www.sonhosting.com");
        }
      } else {
        window.location.replace("https://www.sonhosting.com/en/");
      }
    })
    .catch((error) => {
      console.error("Error fetching IP information:", error);
    });
}


async function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "cd8fb17c68dfe6aeec96f342d966ee73";

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
          const cityName = data.name;
          const country = data.sys.country;

          const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(
            navigator.userAgent
          );
          if (isBot) {
            console.log("The user is a bot.");
          } else {
            detectUserCountry(country);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        console.log("An error occurred while fetching weather data.");
      }
    });
  } else {
    console.log("Geolocation is not supported in your browser.");
  }
}

getLocation()