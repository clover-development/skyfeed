const Conversation = require('./conversation');

class VKConversation extends Conversation {
    constructor(client, attrs) {
        super();
        this.client = client;
        this.apiClient = this.client.apiClient;
        this.id = attrs.id;
        this.userID = attrs.userID;
        this.chatID = attrs.chatID;
        this.conversationTitle = attrs.conversationTitle;
        this.conversationText = attrs.conversationText;
        this.conversationPhoto = attrs.conversationPhoto;
    }

    parseMessages(items, callback) {
        let result = items.map((item) => {
            let date = new Date(item.date * 1000);

            return {
                id: item.id,
                userID: item.user_id,
                text: item.body,
                isRead: item.read_state,
                isMyMessage: item.out,
                date: date
            }
        });
        callback(result);
    }

    getMessages(callback) {
        let self = this;
        let peerID = this.chatID ? this.chatID + 2000000000 : this.userID;

        this.apiClient.call('messages.getHistory', { count: 50, peer_id: peerID }).then(res => {
            self.parseMessages(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }
}

module.exports = VKConversation;
