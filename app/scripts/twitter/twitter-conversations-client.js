const ConversationsClient = require('../base/conversaions-client');

class TwitterConversationsClient extends ConversationsClient {
    constructor(loginID) {
        super(loginID);
    }
}

module.exports = TwitterConversationsClient;
