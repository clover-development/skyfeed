const loginService = require('../login-service-renderer');

class FeedClient {
    constructor(loginID) {
        this.loginID = loginID;
    }

    getPosts(callback) {
        callback([]);
    }

    getLogin() {
        return loginService.findLogin(this.loginID)
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = FeedClient;
