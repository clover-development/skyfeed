const electron = require('electron');

// Require and activate debug tools
require('electron-debug')({showDevTools: false});

// Module to control application life.
const app = electron.app;
const {ipcMain} = require('electron');

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

ipcMain.on("facebook-button-clicked",function (event, arg) {
    var options = {
        client_id: '417849138574921',
        scopes: "public_profile",
        redirect_uri: "https://www.facebook.com/connect/login_success.html"
    };
    var authWindow = window.createWindow({ width: 450, height: 300, show: false, 'node-integration': false });
    var facebookAuthURL = `https://www.facebook.com/dialog/oauth?client_id=${options.client_id}&redirect_uri=${options.redirect_uri}&response_type=token&scope=${options.scopes}&display=popup`;
    authWindow.showUrl(facebookAuthURL);
    authWindow.show();
    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
        access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        error = /\?error=(.+)$/.exec(newUrl);
        if(access_token) {
            console.log(access_token);
            // FB.setAccessToken(access_token);
            // FB.api('/me', { fields: ['id', 'name', 'picture.width(800).height(800)'] }, function (res) {
            //     mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-name\").innerHTML = \" Name: " + res.name + "\"");
            //     mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-id\").innerHTML = \" ID: " + res.id + "\"");
            //     mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-dp\").src = \"" + res.picture.data.url + "\"");
            // });
            authWindow.close();
        }
    });
});
