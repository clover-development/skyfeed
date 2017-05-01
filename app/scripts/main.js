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
const login = require('./login');
const VKApi = require('node-vkapi');

let mainWindow = undefined;

function createWindow () {
  mainWindow = window.createWindow({ width: 1800, height: 1000, show: true  });
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
    let options = {
        client_id: '417849138574921',
        scope: 'public_profile,user_about_me,user_posts,user_friends',
        redirect_uri: 'https://www.facebook.com/connect/login_success.html',
        display: 'popup',
        response_type: 'token',
        auth_type: 'rerequest'
    };
    login('https://www.facebook.com/dialog/oauth', options, function (token) {
        console.log(token);
    }, function (error) {
        console.log(error);
    });
});

ipcMain.on("vk-button-clicked",function (event, arg) {
    let options = {
        display: 'page',
        response_type: 'token',
        client_id: '6001195',
        redirect_uri: 'https://oauth.vk.com/blank.html',
        scope: '80902'
    };
    login('https://oauth.vk.com/authorize', options, function (token) {
        console.log(token);
        let client = new VKApi({token : token});
        global.vkLogin = { token: token, client: client };
        mainWindow.webContents.send('login-success');
    }, function (error) {
        console.log(error);
    });
});
