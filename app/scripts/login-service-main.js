const storage = require('electron-json-storage');
const empty = require('is-empty');
const state = require('./shared-state');
const clientsClassMap = require('./clients/map');

state.logins = [];

function loadLogins() {
    storage.get('logins', function (error, data) {
        if (error) throw error;

        if (!empty(data)) {
            let parsedLogins = data.map((attrs) => { return new clientsClassMap[attrs.klass](attrs); });
            state.logins = parsedLogins;
        }
    })
}

function persistLogins() {
    let loginAttributes = state.logins.map((login) => { return login.getAttributes(); });
    storage.set('logins', loginAttributes, function (error) {
        if (error) throw error;
    })
}

function addLogin(login) {
    state.logins.push(login);
    persistLogins();
}

loadLogins();

module.exports = {
    loadLogins: loadLogins,
    persistLogins: persistLogins,
    addLogin: addLogin
};
