const state = require('../shared-state');
const loginService = require('../login-service-renderer');

let buffer = [];
let subBuffers = {};
let pageSize = 50;
let page = 0;

function reset() {
    buffer = [];
    subBuffers = {};
    initializeSubBuffers();
    page = 0;
}

function checkLoginsPresence(callback) {
    if(!loginService.anyLogin()) {
        callback('No Logins', null);
    }
}

function initializeSubBuffers() {
    loginService.getLogins().forEach((login) => {
        login.feedClient.resetPage();

        if (!subBuffers[login.id]) {
            subBuffers[login.id] = [];
        }
    });
}

function getPosts(callback) {
    checkLoginsPresence(callback);

    let fetchCount = 0;
    let logins = loginService.getLogins();
    logins.forEach((login) => {
        fetchCount++;
        login.getPosts(0, posts => {
            if (posts.length) {
                subBuffers[login.id].push(...posts);
                subBuffers[login.id] = subBuffers[login.id].sort((a, b) => { return b.date - a.date });
                buffer.push(...posts);
            }

            fetchCount--;
            if (fetchCount == 0) {
                buffer = buffer.sort((a, b) => { return b.date - a.date });
                let start = page++ * pageSize;
                let end = start + pageSize;
                callback(buffer.slice(start, end));
            }
        });
    });
}

module.exports = {
    getPosts: getPosts,
    reset: reset
};
