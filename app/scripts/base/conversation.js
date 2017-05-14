const LoginIdentifiable = require('./login-identefiable');

class Conversation extends LoginIdentifiable {
    constructor(loginID, attrs) {
        super(loginID);

        Object.assign(this, attrs);
    }
}

module.exports = Conversation;
