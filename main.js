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

// var server = expressApp.listen(3080, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log("Listening at http://%s:%s", host, port);
// });
