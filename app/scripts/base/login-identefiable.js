const state = require('../shared-state');

class LoginIdentifiable {
    constructor(loginID) {
        this.loginID = loginID;
    }

    getLogin() {
        return state.logins.find((login) => { return login.id == this.loginID })
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = LoginIdentifiable;
