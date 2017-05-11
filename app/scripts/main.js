const {app, ipcMain} = require('electron');
// Require and activate debug tools
require('electron-debug')({showDevTools: false});

// Dependencies
const path = require('path');
const window = require('electron-window');
const oauthLogin = require('./oauth-login');
const loginService = require('./login-service-main');
const buildUrl = require('build-url');
const unirest = require('unirest');
const queryString = require('query-string');
const VKClient = require('./clients/vk-client');
const TwitterClient = require('./clients/twitter-client');
const shared = require('./shared-state');

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

ipcMain.on('twitter-button-clicked', function () {
    let oauthParams = {
        callback: 'oob',
        consumer_key: 'H0qR6Rf3ijBilTF25Js8RnnLB',
        consumer_secret: 'b6sNgLUvVZMomLNRsFmLIbNXIJ9qM8t2Hr13Tf6PSdP7IwHUaa'
    };
    unirest.post('https://api.twitter.com/oauth/request_token').oauth(oauthParams).end((res) => {
        let parsedResponse = queryString.parse(res.body);
        let oauthToken = parsedResponse.oauth_token;
        let authWindow = window.createWindow({ width: 800, height: 600, show: false, 'node-integration': false });
        let url = buildUrl('https://api.twitter.com/oauth/authorize', { queryParams: { oauth_token: oauthToken } });
        authWindow.showUrl(url);
        authWindow.show();
        authWindow.webContents.on('did-finish-load', function () {
            if (authWindow.webContents.getURL() === 'https://api.twitter.com/oauth/authorize') {
                let code = "require('electron').ipcRenderer.send('twitter-auth-pin', document.querySelector('#oauth_pin code').textContent);";
                authWindow.webContents.executeJavaScript(code);
                ipcMain.on('twitter-auth-pin', (_, code) => {
                    oauthParams.token = oauthToken;
                    oauthParams.verifier = code;
                    unirest.post('https://api.twitter.com/oauth/access_token').oauth(oauthParams).end((res) => {
                        let parsedResponse = queryString.parse(res.body);
                        authWindow.close();
                        let client = new TwitterClient({token: parsedResponse.oauth_token, tokenSecret: parsedResponse.oauth_token_secret});
                        loginService.addLogin(client);
                        mainWindow.webContents.send('login-success');
                    })
                });
            }
        });
    });
});

ipcMain.on('logout', (_, loginID) => {
    loginService.removeLogin(loginID);
    mainWindow.webContents.send('logout-success');
});
