/* ---- START CONFIG ---- */

var obj = {
  events: [],
};

// check current time and play music

var currentTime;
let lastFileURL = "";

function updateCurrentTime() {
  currentTime = new Date().toLocaleTimeString();
  currentTime = currentTime.split(":");
  currentTime = currentTime[0] + ":" + currentTime[1];
}

/* ---- END CONFIG ---- */

// load data from db upon loading page
document.onload = getData();

/* ---- FUNCTIONS ---- */

// get data from LOWDB database
function getData() {
  // send data as GET request to server
  fetch("http://localhost:3080/getEvents")
    .then((res) => res.json())
    .then((data) => {
      obj.events = data;
      sortEvents();
      loadTable(obj.events);
    })
    .catch((err) => {
      console.log(err);
    });
}

// load table
function loadTable(array) {
  // clear table
  document.getElementById("table-content").innerHTML = "";

  array.forEach((element) => {
    addRowToTable(element.time, element.name);
  });
}

// add row to table
function addRowToTable(time, name) {
  let tableContent = document.getElementById("table-content");
  let tableData = tableContent.innerHTML;

  let newTableContent =
    `
    <tr id="` +
    time +
    `">
        <td>` +
    time +
    `</td>
        <td>` +
    name +
    `</td>
        <td>
            <div class="btn-group" role="group">
                <!-- <button class="edit-event-btn btn btn-light link-primary"
                    data-bs-toggle="tooltip" data-bss-tooltip="" type="button" title="Edit"
                    style="border-style: solid;border-color: var(--bs-btn-hover-border-color);">
                    <i class="fas fa-pencil-alt"></i>
                </button> -->
                <button class="delete-event-btn btn btn-light link-danger" data-bs-toggle="tooltip"
                    data-bss-tooltip="" type="button" title="Delete"
                    style="border-color: var(--bs-btn-hover-border-color);" onclick="deleteEvent('` +
    time +
    `')" >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>
    </tr>
    `;

  // add row to existing table
  tableData += newTableContent;
  tableContent.innerHTML = tableData;
}

// event listener to catch file upload input field change

let fileInput = document.getElementById("form_file");
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  lastFileURL = file.path;
  console.log(file.path);
});

// create new event and add it to the table object
function createNewEvent() {
  let name = document.getElementById("form_name").value;
  let time = document.getElementById("form_time").value;
  // let url = document.getElementById("form_file").value;
  let url = lastFileURL;

  // validate form
  if (name == "" || time == "" || url == "") {
    alert("Please fill out all fields.");
    return;
  }

  // send data to database

  // send data as POST request to server
  fetch("http://localhost:3080/addEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      time: time,
      url: url,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      // location.reload();
      getData();
    })
    .catch((err) => {
      console.log(err);
      alert("Error. Could not add event.");
    });

  resetForm();
}

function deleteEvent(time) {
  // send data as POST request to server
  fetch("http://localhost:3080/deleteEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: time,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      // location.reload();
      getData();
    })
    .catch((err) => {
      console.log(err);
      alert("Error. Could not delete event.");
    });
}

function hideAlert() {
  document.getElementById("alert--row").style.display = "none";
  location.reload();
}

// create error message
function throwError(error, refresh) {
  document.getElementById("error-field").innerHTML = error;
  document.getElementById("alert--row").style.display = "block";
  document
    .getElementById("navbar-main")
    .style.setProperty("background-color", "#dc3545", "important");
}

function resetForm() {
  document.getElementById("new-event-form").reset();
}

function displayTime() {
  var now = new Date();
  let time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  document.getElementById("time_display").innerHTML = time;
}

// sort events by time
function sortEvents() {
  obj.events.sort(function (a, b) {
    let timeA = a.time.split(":");
    let timeB = b.time.split(":");
    let dateA = new Date();
    let dateB = new Date();
    dateA.setHours(timeA[0]);
    dateA.setMinutes(timeA[1]);
    dateB.setHours(timeB[0]);
    dateB.setMinutes(timeB[1]);
    return dateA - dateB;
  });
}

// check events and time each minute

function checkEventsAndTime() {
  for (var i = 0; i < obj.events.length; i++) {
    if (obj.events[i].time === currentTime) {
      console.log("Event @ " + obj.events[i].time);
      if (obj.events[i].time != nowPlaying) {
        console.log("event already playing");
        playAudio(obj.events[i].url, obj.events[i].time);
      }
    }
  }
}

// music player code

var x = document.getElementById("mainAudio");
var nowPlaying;

function playAudio(url, eventTime) {
  x.src = url;

  x.play();
  nowPlaying = eventTime;
  console.log("Now playing event @ " + eventTime);
}

function stopAudio() {
  x.pause();
  x.currentTime = 0;
}

// music player code end

setInterval(displayTime, 1000);
setInterval(checkEventsAndTime, 1000);
setInterval(updateCurrentTime, 1000);
