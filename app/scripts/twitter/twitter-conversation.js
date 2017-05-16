const Conversation = require('../base/conversation');

class TwitterConversation extends Conversation {

    constructor(loginID, attrs) {
        super(loginID, attrs);

        this.fetched = false;
    }

    resetPage() {
        this.fetched = false;
    }

    getMessages(callback) {
        if (this.fetched) { callback([]); return }
        this.fetched = true;
        callback(this.messages);
    }
}

module.exports = TwitterConversation;
