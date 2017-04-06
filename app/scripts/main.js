const electron = require('electron');
// Require and activate debug tools
require('electron-debug')({showDevTools: false});
// Module to control application life.
const app = electron.app;
//const protocol = electron.protocol
// Dependencies

const pug = require('electron-pug')({pretty: true});
const path = require('path');
const window = require('electron-window');

function createWindow () {
  // Create the browser window.

  const mainWindow = window.createWindow({ width: 800, height: 600, show: true  });
  const indexPath = path.join(__dirname, '../index.pug');
  mainWindow.showUrl(indexPath);
  mainWindow.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
