// electron JS setup
const { app, BrowserWindow } = require("electron");

// express js setup
const express = require("express");
const expressApp = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// LOWDB Config
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ events: [], user: {} }).write();

// LOWdb config end

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

//create an endpoint to getData from database
expressApp.get("/getEvents", cors(), function (req, res) {
  let events = db.get("events").value();
  res.send(events);
});

//create an endpoint to add data to database
expressApp.post("/addEvent", cors(), bodyParser.json(), function (req, res) {
  let data = req.body;
  let existingEvent = db.get("events").find({ time: data.time }).value();
  if (existingEvent) {
    return res.json({
      message: "Event already exists",
    });
  } else {
    db.get("events").push(data).write();
    return res.status(200).json({
      message: "Event added successfully",
    });
  }
});

//create an endpoint to delete data from database
expressApp.post("/deleteEvent", cors(), bodyParser.json(), function (req, res) {
  let data = req.body;
  let existingEvent = db.get("events").find({ time: data.time }).value();
  if (existingEvent) {
    db.get("events").remove({ time: data.time }).write();
    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } else {
    return res.json({
      message: "Event does not exist",
    });
  }
});

var server = expressApp.listen(3080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
