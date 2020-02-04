const { app, BrowserWindow } = require('electron')
const path = require('path');
const debug = require('electron-debug');
require('electron-reload')(path.resolve(__dirname, 'dist'));

debug();

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1200,
    height: 800,
    //frame: false,
    webPreferences: {
      nodeIntegration: true,
      sandbox: false
    }
  });

  // and load the index.html of the app.
  win.loadFile('./dist/index.html');
}

app.on('ready', createWindow)