/* ---- START CONFIG ---- */

var obj = {
  events: [],
};

/* ---- END CONFIG ---- */

getData();

document.querySelectorAll(".delete-event-btn").forEach((element) => {
  console.log(element);
  // element.addEventListener("click", function () {
  //   let _time = element.parentNode.parentNode.parentNode.id;
  //   deleteEvent(_time);
  // });
});

/* ---- FUNCTIONS ---- */

// get data from LOWDB database
function getData() {
  // send data as GET request to server
  fetch("http://localhost:3080/getEvents")
    .then((res) => res.json())
    .then((data) => {
      obj.events = data;
      loadTable(obj.events);
    })
    .catch((err) => {
      console.log(err);
    });
}

// load table
function loadTable(array) {
  // remove 'no events found' notice
  document.getElementById("table--empty-text").style.display = "none";
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
                    style="border-color: var(--bs-btn-hover-border-color);">
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

// create new event and add it to the table object
function createNewEvent() {
  let name = document.getElementById("form_name").value;
  let time = document.getElementById("form_time").value;
  let url = document.getElementById("form_file").value;

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
      location.reload();
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
      location.reload();
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

setInterval(displayTime, 1000);
