const LoginIdentifiable = require('./login-identefiable');

class Conversation extends LoginIdentifiable {
    constructor(loginID, attrs) {
        super(loginID);

        Object.assign(this, attrs);
    }

    getMessages(callback) {
        console.log('Not Implemented');
        callback([])
    }

    resetPage() {
        console.log('Not Implemented');
    }
}

module.exports = Conversation;
