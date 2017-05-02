const storage = require('electron-json-storage');

let _logins = [];

function loadLogins() {
    storage.get('logins', function (error, data) {
        if (error) throw error;

        console.log('Loading logins from disk: ', data);
        _logins = data;
    })
}

function persistLogins() {
    storage.set('logins', _logins, function (error) {
        if (error) throw error;

        console.log('Saving logins to disk: ', _logins);
    })
}

function addLogin() {

}

loadLogins();

module.exports = {
    loadLogins: loadLogins,
    persistLogins: persistLogins,
    addLogin: addLogin,
};
