const empty = require('is-empty');
const state = require('./shared-state');

function getLogins() {
    return state.logins;
}

function anyLogin() {
    return !empty(getLogins());
}

function findLogin(loginID) {
    return state.logins.find((login) => { return login.id == loginID });
}

module.exports = {
    getLogins: getLogins,
    anyLogin: anyLogin,
    findLogin: findLogin
};
