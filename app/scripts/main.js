const electron = require('electron');

// Require and activate debug tools
require('electron-debug')({showDevTools: false});

// Module to control application life.
const app = electron.app;

// Dependencies
const pug = require('electron-pug')({pretty: true});
const path = require('path');
const window = require('electron-window');

function createWindow () {
  const mainWindow = window.createWindow({ width: 1800, height: 1000, show: true  });
  const indexPath = path.join(__dirname, '../index.pug');
  mainWindow.showUrl(indexPath);
  mainWindow.openDevTools();
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});
