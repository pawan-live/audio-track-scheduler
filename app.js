/* ---- START CONFIG ---- */

var obj = {
  table: [],
};

// var defaultErrorMsg = "Please contact developer for assistance.";

// authentication state for password
// var authState;

/* ---- END CONFIG ---- */

getData();

/* ---- FUNCTIONS ---- */

// read json file on load
function getData() {
  fetch("/getUsers")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
// function getData() {
//   fetch("./data.json")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => (obj = data))
//     .then(function () {
//       if (obj.table.length > 0) {
//         loadTable(obj.table);
//       } else {
//         console.log("no data");
//       }
//     });
// }

// timer event

// set display time

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

function createNewEvent() {
  let name = document.getElementById("form_name");
  let time = document.getElementById("form_time");
  let url = document.getElementById("form_url");

  console.log(name.value, time.value, url.value);

  obj.table.push({ id: time.value, name: name.value, file: url.value });
  var json = JSON.stringify(obj);

  // writeFile("data.json", json, "utf8", function () {
  //   console.log("complete");
  // });
}

// delete event
function deleteEvent(id) {
  if (confirm("Are you sure you want to delete?") == true) {
    authState;
    validatePassword();
    if (authState == true) {
      console.log("deleted event");
    } else {
      console.log("x");
    }
  }
}

// edit event
function editEvent(id) {
  if (confirm("Are you sure you want to edit?") == true) {
    console.log("edited event " + id);
  }
}

// fetch JSON data
// async function fetchJSON(url) {
//   try {
//     const response = await fetch(url);
//     return await response.json();
//   } catch (err) {
//     throwError(err);
//   }
// }

// sets authentication state to false
// function resetAuth() {
//   authState = false;
// }

// validate password
// function validatePassword() {
//   let jsonData;
//   authState = false; // reset authstate

//   fetchJSON("./config.json")
//     .then((data) => {
//       jsonData = data;
//     })
//     .then(() => {
//       if (
//         prompt("Enter password to continue.") == jsonData.settings[0].password
//       ) {
//         authState = true;
//       } else {
//         authState = false;
//         alert("Incorrect password.");
//       }
//     });
// }

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
  time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  document.getElementById("time_display").innerHTML = time;
}

setInterval(displayTime, 1000);
