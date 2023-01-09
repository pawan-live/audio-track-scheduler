/* ---- START CONFIG ---- */

// LOWDB Setup
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

var obj = {
  table: [],
};

/* ---- END CONFIG ---- */

// getData();

/* ---- FUNCTIONS ---- */

// get data from LOWDB database
// function getData() {}

// load table
function loadTable(array) {
  // remove 'no events found' notice
  document.getElementById("table--empty-text").style.display = "none";
  array.forEach((element) => {
    addRowToTable(element.name, element.id);
  });
}

// add row to table
function addRowToTable(name, id) {
  let tableContent = document.getElementById("table-content");
  let tableData = tableContent.innerHTML;

  let newTableContent =
    `
    <tr id="` +
    id +
    `">
        <td>` +
    id +
    `</td>
        <td>` +
    name +
    `</td>
        <td>
            <div class="btn-group" role="group">
                <!-- <button class="btn btn-light link-primary"
                    data-bs-toggle="tooltip" data-bss-tooltip="" type="button" title="Edit"
                    style="border-style: solid;border-color: var(--bs-btn-hover-border-color);">
                    <i class="fas fa-pencil-alt"></i>
                </button> -->
                <button class="btn btn-light link-danger" data-bs-toggle="tooltip"
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
    throwError("Please fill out all fields.");
    return;
  }

  obj.table.push({ id: time, name: name, file: url });
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
    hour12: true,
  });
  document.getElementById("time_display").innerHTML = time;
}

setInterval(displayTime, 1000);
