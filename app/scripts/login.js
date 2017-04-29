'use strict';

const buildUrl = require('build-url');
const window = require('electron-window');

module.exports = function (mainUrl, options, successCallback, errorCallback) {
    let authWindow = window.createWindow({ width: 600, height: 400, show: false, 'node-integration': false });
    let url = buildUrl(mainUrl, { queryParams: options });
    authWindow.showUrl(url);
    authWindow.show();
    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
        let raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
        let access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        let error = /\?error=(.+)$/.exec(newUrl);
        if (access_token) {
            authWindow.close();
            successCallback(access_token);
        } else if (error) {
            authWindow.close();
            errorCallback(error);
        }
    });
};
