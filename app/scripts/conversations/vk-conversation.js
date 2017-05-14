const Conversation = require('./conversation');
const VKPhotoParser = require('../toolkit/vk-photo-parser');

class VKConversation extends Conversation {
    constructor(client, attrs) {
        super();
        this.client = client;
        this.apiClient = this.client.apiClient;
        this.offset = 0;
        Object.assign(this, attrs);
    }

    parseMessages(items, callback) {
        let result = items.map((item) => {
            let date = new Date(item.date * 1000);
            let photos = VKPhotoParser.parse(item.attachments, 604);

            return {
                id: item.id,
                userID: item.user_id,
                text: item.body,
                isMyMessage: item.out,
                date: date,
                photos: photos
            }
        });
        callback(result);
    }

    getMessages(callback) {
        let self = this;
        let peerID = this.chatID ? this.chatID + 2000000000 : this.userID;

        let params = {
            count: 50,
            offset: this.offset,
            peer_id: peerID
        };

        this.apiClient.call('messages.getHistory', params).then(res => {
            this.offset += 50;
            self.parseMessages(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }

    sendMessage(message, callback) {
        let self = this;
        let peerID = this.chatID ? this.chatID + 2000000000 : this.userID;

        let params = {
            message: message,
            peer_id: peerID
        };

        this.apiClient.call('messages.send', params).then(res => {
            callback(null, {
                id: res,
                userID: peerID,
                text: message,
                isMyMessage: 1,
                date: new Date(),
                photos: []
            })
        });
    }
}

module.exports = VKConversation;
