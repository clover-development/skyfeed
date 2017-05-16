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

    sendMessage(message, callback) {
        let self = this;

        let params = {
            text: message,
            user_id: self.id
        };

        this.getAPIClient().post('direct_messages/new', params, (error, message) => {
            callback(null, {
                id: message.id,
                userID: self.id,
                text: message.text,
                isMyMessage: true,
                date: new Date(message.created_at),
                photos: []
            })
        });
    }
}

module.exports = TwitterConversation;
