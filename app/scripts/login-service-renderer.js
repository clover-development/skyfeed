const empty = require('is-empty');
const state = require('./shared-state');

function getLogins() {
    return state.logins;
}

function anyLogin() {
    return !empty(getLogins());
}

module.exports = {
    getLogins: getLogins,
    anyLogin: anyLogin
};
