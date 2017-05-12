'use strict';

const { ipcMain } = require('electron');
const window = require('electron-window');
const buildUrl = require('build-url');
const unirest = require('unirest');
const queryString = require('query-string');

function loginVK(callback) {
    let options = {
        display: 'page',
        response_type: 'token',
        client_id: '6001195',
        redirect_uri: 'https://oauth.vk.com/blank.html',
        scope: '80902'
    };

    let authWindow = window.createWindow({ width: 800, height: 600, show: false, 'node-integration': false });
    let url = buildUrl('https://oauth.vk.com/authorize', { queryParams: options });

    authWindow.webContents.session.clearStorageData({storages: ['cookies']}, () => {
        authWindow.showUrl(url);
        authWindow.show();

        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            let raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
            let access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            let error = /\?error=(.+)$/.exec(newUrl);

            if (access_token) {
                authWindow.close();
                callback(null, access_token);
            } else if (error) {
                authWindow.close();
                callback(error, null);
            }
        });
    });
}

function loginTwitter(callback) {
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

        authWindow.webContents.session.clearStorageData({storages: ['cookies']}, () => {
            authWindow.showUrl(url);
            authWindow.show();

            authWindow.webContents.on('did-finish-load', function () {
                if (authWindow.webContents.getURL() !== 'https://api.twitter.com/oauth/authorize') { return }

                let code = "require('electron').ipcRenderer.send('twitter-auth-pin', document.querySelector('#oauth_pin code').textContent);";
                authWindow.webContents.executeJavaScript(code);

                ipcMain.on('twitter-auth-pin', (_, code) => {
                    oauthParams.token = oauthToken;
                    oauthParams.verifier = code;

                    unirest.post('https://api.twitter.com/oauth/access_token').oauth(oauthParams).end((res) => {
                        let parsedResponse = queryString.parse(res.body);
                        authWindow.close();
                        callback(parsedResponse.errors, parsedResponse.oauth_token, parsedResponse.oauth_token_secret)
                    })
                });
            });
        });
    });
}

module.exports = {
    loginTwitter: loginTwitter,
    loginVK: loginVK
};
