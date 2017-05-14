const state = require('../shared-state');
const loginService = require('../login-service-renderer');

let buffer = [];
let subBuffers = {};
let pageSize = 50;

function checkLoginsPresence(callback) {
    if(!loginService.anyLogin()) {
        callback('No Logins', null);
    }
}

function initializeSubBuffers() {
    loginService.getLogins().forEach((login) => {
        if (!subBuffers[login.id]) {
            subBuffers[login.id] = [];
        }
    });
}

function getPosts(page = 0, callback) {
    checkLoginsPresence(callback);
    initializeSubBuffers();
    let logins = loginService.getLogins();
}

module.exports = {
    getPosts: getPosts
};
