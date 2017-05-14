const LoginIdentifiable = require('./login-identefiable');

class FeedClient extends LoginIdentifiable {
    constructor(loginID) {
        super(loginID);
    }

    getPosts(callback) {
        callback([]);
    }
}

module.exports = FeedClient;
