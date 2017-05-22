const LoginIdentifiable = require('./login-identefiable');

class FeedClient extends LoginIdentifiable {
    constructor(loginID) {
        super(loginID);
    }

    resetPage() {}

    getPosts(callback) {
        callback([]);
    }
}

module.exports = FeedClient;
