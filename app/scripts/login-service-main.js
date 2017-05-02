const storage = require('electron-json-storage');
const empty = require('is-empty');
const state = require('./shared-state');

state.logins = [];

function loadLogins() {
    storage.get('logins', function (error, data) {
        if (error) throw error;

        if (!empty(data)) {
            state.logins = data;
        }
    })
}

function persistLogins() {
    storage.set('logins', state.logins, function (error) {
        if (error) throw error;
    })
}

function addLogin(login) {
    state.logins.push(login);
    persistLogins();
}

// TODO: Implement serializing and de-serializing of logins
// loadLogins();

module.exports = {
    loadLogins: loadLogins,
    persistLogins: persistLogins,
    addLogin: addLogin
};
