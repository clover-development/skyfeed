const loginService = require('../login-service-renderer');

class LoginIdentifiable {
    constructor(loginID) {
        this.loginID = loginID;
    }

    getLogin() {
        return loginService.findLogin(this.loginID)
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = LoginIdentifiable;
