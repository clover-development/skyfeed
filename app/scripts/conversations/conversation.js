const loginService = require('../login-service-renderer');

class Conversation {
    constructor(loginID, attrs) {
        this.loginID = loginID;

        Object.assign(this, attrs);
    }

    getLogin() {
        return loginService.findLogin(this.loginID);
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = Conversation;
