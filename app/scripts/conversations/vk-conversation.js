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
        this.isConversationRead = attrs.isConversationRead;
        this.isMyMessage = attrs.isMyMessage;
    }

    parseMessages(items, callback) {
        let result = items.map((item) => {
            let date = new Date(item.date * 1000);
            let photos = (item.attachments || []).filter((скрепа) => {
                return скрепа.type === 'photo';
            }).map((photoAttachment) => {
                let photo = photoAttachment.photo;
                let photoSizes = Object.keys(photo).filter((key) => {
                    return key.startsWith('photo_');
                }).map((key) => {
                    return parseInt(key.replace('photo_', ''));
                }).sort();

                let bigPhotoSize = photoSizes[photoSizes.length - 1];

                let smallPhotoSize = bigPhotoSize;
                for (let i = photoSizes.length - 1; i >= 0; i--) {
                    if (photoSizes[i] <= 604) { smallPhotoSize = photoSizes[i]; }
                }

                return {
                    id: photo.id,
                    date: photo.date,
                    smallURL: photo['photo_' + smallPhotoSize],
                    bigURL: photo['photo_' + bigPhotoSize]
                }
            });

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

        this.apiClient.call('messages.getHistory', { count: 50, peer_id: peerID }).then(res => {
            self.parseMessages(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }

    sendMessage(message) {
        let peerID = this.chatID ? this.chatID + 2000000000 : this.userID;

        let params = {
            message: message,
            peer_id: peerID
        };

        this.apiClient.call('messages.send', params).then(res => {
            self.parseMessages(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }
}

module.exports = VKConversation;
