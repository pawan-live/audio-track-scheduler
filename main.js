// electron JS setup
const { app, BrowserWindow } = require("electron");
var express = require("express");
var expressApp = express();
var fs = require("fs"); //require file system object

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 1400,
  });

  win.loadFile("index.html");
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

// express app

// Endpoint to Get a list of users
expressApp.get("/getUsers", function (req, res) {
  fs.readFile(__dirname + "/" + "data.json", "utf8", function (err, data) {
    // res.end(data); // you can also use res.send()
    res.send(data);
  });
});

var server = expressApp.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Listening at http://%s:%s", host, port);
});
