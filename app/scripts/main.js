const {app, ipcMain} = require('electron');
// Require and activate debug tools
require('electron-debug')({showDevTools: false});

// Dependencies
const path = require('path');
const window = require('electron-window');
const oauthLogin = require('./oauth-login');
const loginService = require('./login-service-main');
const { VKClient } = require('./clients/vk-client');

let mainWindow = undefined;

console.log('Application settings path is: ', app.getPath('userData'));

function createWindow () {
  const iconPath = path.join(__dirname, '../images/icon.png');
  mainWindow = window.createWindow({ width: 1800, height: 1000, show: true, icon: iconPath });
  const indexPath = path.join(__dirname, '../index.jade');
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

ipcMain.on('vk-button-clicked', function () {
    let options = {
        display: 'page',
        response_type: 'token',
        client_id: '6001195',
        redirect_uri: 'https://oauth.vk.com/blank.html',
        scope: '80902'
    };
    oauthLogin('https://oauth.vk.com/authorize', options, function (token) {
        let client = new VKClient({token: token});
        loginService.addLogin(client);
        mainWindow.webContents.send('login-success');
    }, function (error) {
        console.log(error);
    });
});
