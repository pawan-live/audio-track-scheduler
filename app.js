// main code

/* ---- DECLARATIONS ---- */
var obj = {
  table: [],
};

/* ---- SEQUENTIAL ---- */

// read json file on load
fetch("./data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => (obj = data))
  .then(function () {
    console.log(keys);
  });

/* ---- FUNCTIONS ---- */

// read JSON file and get main JSON object to an array
function readJSON(file) {}
