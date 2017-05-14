const LoginIdentifiable = require('./login-identefiable');

class ConversationsClient extends LoginIdentifiable {
    constructor(loginID) {
        super(loginID);
    }

    getDialogs(callback) {
        callback([]);
    }
}

module.exports = ConversationsClient;
