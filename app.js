// check if browser supports IndexedDB
if (!window.indexedDB) {
  console.log(`Your browser doesn't support IndexedDB. The app will not work.`);
  alert("Your browser doesn't support IndexedDB. The app will not work.");
}

// set object structure
var obj = {
  events: [],
};

// setup indexedDB connection
const request = indexedDB.open("ALARMAPP", 1);

// create the Events object store and indexes
request.onupgradeneeded = (event) => {
  let db = event.target.result;

  // create the Contacts object store
  // with auto-increment id
  let store = db.createObjectStore(
    "Events",
    { keyPath: "time", autoIncrement: false }
    // { keyPath: "time" }
  );

  // create an index on the time property
  store.createIndex("time", "time", {
    unique: true,
  });
};

request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};

request.onsuccess = (event) => {
  const db = event.target.result;
  // get all contacts
  getData(db);
};

// get current time
var currentTime;
let lastFileURL = ""; // file selected at input field

function updateCurrentTime() {
  // get 24 hour time
  currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });

  // currentTime = new Date().toLocaleTimeString();
  currentTime = currentTime.split(":");
  currentTime = currentTime[0] + ":" + currentTime[1];
}

// get data from LOWDB database
function getData(db) {
  obj.events = [];
  // get all data from events store in Indexed DB
  const txn = db.transaction("Events", "readonly");
  const objectStore = txn.objectStore("Events");

  objectStore.openCursor().onsuccess = (event) => {
    let cursor = event.target.result;
    if (cursor) {
      let event = cursor.value;
      // add event to events object
      console.log(event);
      obj.events.push(event);
      // continue next record
      cursor.continue();
    }
  };
  // close the database connection
  txn.oncomplete = function () {
    db.close();
    console.log("closed intial connection");
    // load table
    loadTable(obj.events);
  };
}

function insertEvent(db, newEvent) {
  // create a new transaction
  const txn = db.transaction("Events", "readwrite");

  // get the Events object store
  const store = txn.objectStore("Events");

  // check if event already exists
  let existingEvent = store.get(newEvent.time);
  existingEvent.onsuccess = function (event) {
    if (existingEvent.result) {
      alert("Event already exists", () => {
        return;
      });
    } else {
      let query = store.put(newEvent);
      // handle success case
      query.onsuccess = function (event) {
        console.log(event);
        // fetch data to the obj object
        getData(db);
      };

      // handle the error case
      query.onerror = function (event) {
        console.log(event.target.errorCode);
      };
    }
  };

  // close the database once the
  // transaction completes
  // txn.oncomplete = function () {
  //   db.close();
  //   alert("Event added successfully");
  // };
}

// function that handles the database event deletion
function _deleteEvent(db, time) {
  // create a new transaction
  const txn = db.transaction("Events", "readwrite");

  // get the Contacts object store
  const store = txn.objectStore("Events");
  //
  let query = store.delete(time);

  // handle the success case
  query.onsuccess = function (event) {
    console.log(event);

    // fetch data to the obj object
    getData(db);
  };

  // handle the error case
  query.onerror = function (event) {
    console.log(event.target.errorCode);
  };

  // close the database once the
  // transaction completes
  txn.oncomplete = function () {
    db.close();
  };
}

// load table
function loadTable(array) {
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
// this captures the real file path
let fileInput = document.getElementById("form_file");
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  lastFileURL = file.path;
  console.log(file.path);
});

// create new event and add it to the events object
function createNewEvent() {
  let name = document.getElementById("form_name").value;
  let time = document.getElementById("form_time").value;
  let url = lastFileURL;

  // validate form
  if (name == "" || time == "" || url == "") {
    alert("Please fill out all fields.");
    return;
  }
  let confirmation = confirm("Are you sure you want to add this event?");
  if (!confirmation) {
    return;
  } else {
    // new indexedDB connection
    let request = window.indexedDB.open("ALARMAPP", 1);

    request.onerror = (event) => {
      console.log("Error opening database");
    };

    request.onsuccess = (event) => {
      console.log("Database opened successfully");
      let db = event.target.result;
      insertEvent(db, { time: time, name: name, url: url });
    };

    resetForm();
  }
}

function deleteEvent(time) {
  let confirmation = confirm("Are you sure you want to delete this event?");

  if (!confirmation) {
    return;
  } else {
    // new indexedDB connection
    let request = window.indexedDB.open("ALARMAPP", 1);

    request.onerror = (event) => {
      console.log("Error opening database");
    };

    request.onsuccess = (event) => {
      console.log("Database opened successfully");
      let db = event.target.result;
      _deleteEvent(db, time);
    };
  }
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

// check events and time and play audio if time matches
function checkEventsAndTime() {
  for (var i = 0; i < obj.events.length; i++) {
    if (obj.events[i].time === currentTime) {
      // check if event is already playing to avoid playing the same music multiple times
      if (obj.events[i].time != nowPlaying) {
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
// music player code ends

// timer functions
setInterval(displayTime, 1000);
setInterval(checkEventsAndTime, 1000);
setInterval(updateCurrentTime, 1000);
