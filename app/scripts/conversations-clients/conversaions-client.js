const loginService = require('../login-service-renderer');

class ConversationsClient {
    constructor(loginID) {
        this.loginID = loginID;
    }

    getDialogs(callback) {
        callback([]);
    }

    getLogin() {
        return loginService.findLogin(this.loginID);
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = ConversationsClient;
