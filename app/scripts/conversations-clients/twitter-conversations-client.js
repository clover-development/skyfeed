const ConversationsClient = require('./conversaions-client');

class TwitterConversationsClient extends ConversationsClient {
    constructor(loginID) {
        super(loginID);
    }
}

module.exports = TwitterConversationsClient;
