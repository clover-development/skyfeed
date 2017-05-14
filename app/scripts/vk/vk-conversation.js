const Conversation = require('../base/conversation');
const VKPhotoParser = require('./vk-photo-parser');

class VKConversation extends Conversation {
    constructor(loginID, attrs) {
        super(loginID, attrs);
        this.offset = 0;
    }

    getMessages(callback) {
        let params = {
            count: 50,
            offset: this.offset,
            peer_id: this.peerID()
        };

        this.getAPIClient().call('messages.getHistory', params).then(res => {
            this.offset += 50;
            this.parseMessages(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }

    sendMessage(message, callback) {
        let params = {
            message: message,
            peer_id: this.peerID()
        };

        this.getAPIClient().call('messages.send', params).then(res => {
            callback(null, {
                id: res,
                userID: this.peerID(),
                text: message,
                isMyMessage: 1,
                date: new Date(),
                photos: []
            })
        });
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

    peerID() {
        return this.chatID ? this.chatID + 2000000000 : this.userID;
    }
}

module.exports = VKConversation;
