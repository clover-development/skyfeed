const {app, ipcMain, BrowserWindow} = require('electron');
// Require and activate debug tools
require('electron-debug')({showDevTools: false});

// Dependencies
const path = require('path');
const url = require('url');
const oauthLogin = require('./oauth-login');
const loginService = require('./login-service-main');
const VKClient = require('./clients/vk-client');
const TwitterClient = require('./clients/twitter-client');
const shared = require('./shared-state');

let mainWindow = undefined;

console.log('Application settings path is: ', app.getPath('userData'));

function createWindow () {
    const iconPath = path.join(__dirname, '../images/icon.png');
    mainWindow = new BrowserWindow({ width: 1800, height: 1000, icon: iconPath });
    const indexPath = path.join(__dirname, '../index.jade');
    const indexUrl = url.format({ protocol: 'file', pathname: indexPath, slashes: true});
    mainWindow.loadURL(indexUrl);
    mainWindow.openDevTools();
    mainWindow.webContents.on('did-finish-load', () => { mainWindow.show() });
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
    oauthLogin.loginVK(function (error, token) {
        if (!!error) {
            console.log('VK login error: ', error);
            return;
        }
        let client = new VKClient({token: token});
        loginService.addLogin(client);
        mainWindow.webContents.send('login-success');
    });
});

ipcMain.on('twitter-button-clicked', function () {
    oauthLogin.loginTwitter(function (error, token, tokenSecret) {
        if (!!error) {
            console.log('Twitter login error: ', error);
            return;
        }
        let client = new TwitterClient({token: token, tokenSecret: tokenSecret});
        loginService.addLogin(client);
        mainWindow.webContents.send('login-success');
    });
});

ipcMain.on('logout', (_, loginID) => {
    loginService.removeLogin(loginID);
    mainWindow.webContents.send('logout-success');
});
