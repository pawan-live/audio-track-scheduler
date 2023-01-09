// electron JS setup
const { app, BrowserWindow } = require("electron");
const express = require("express");
const expressApp = express();
const fs = require("fs"); //require file system object
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 1400,
  });

  win.loadFile(__dirname + "/" + "index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ExpressJS setup

// Endpoint to Get a list of users
expressApp.get("/getData", function (req, res) {
  fs.readFile(__dirname + "/" + "data.json", "utf8", function (err, data) {
    res.send(data);
  });
});

expressApp.use(bodyParser.json());
expressApp.use(cors());

expressApp.post("/writeData", (req, res) => {
  const data = req.body;
  console.log(data);

  // set content-type to json
  res.setHeader("Content-Type", "application/json");

  fs.writeFile(__dirname + "/" + "data.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log(data);
    console.log("Data written to file");
  });

  res.send("Data written to file");
});

var server = expressApp.listen(3080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
