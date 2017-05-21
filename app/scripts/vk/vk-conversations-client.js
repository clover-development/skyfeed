const ConversationsClient = require('../base/conversaions-client');
const VKConversation = require('./vk-conversation');
const pageSize = 50;

class VKConversationsClient extends ConversationsClient {
    constructor(loginID) {
        super(loginID);

        this.offset = 0;
    }

    getDialogs(callback) {
        let params = {
            count: pageSize,
            offset: this.offset,
            preview_length: 100
        };

        this.getAPIClient().call('messages.getDialogs', params).then(res => {
            this.offset += pageSize;
            this.parseDialogs(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }

    getUsers(userIDs, callback) {
        let params = {
            user_ids: userIDs.join(', '),
            fields: 'photo_50'
        };

        this.getAPIClient().call('users.get', params).then(res => {
            let result = res.map((item) => {
                return {
                    id: item.id,
                    fullName: `${item.first_name} ${item.last_name}`,
                    conversationPhoto: item.photo_50
                }
            });
            callback(result);
        });
    }

    parseDialogs(items, callback) {
        let userIds = items.map((item) => { return item.message.user_id });
        this.getUsers(userIds, (users) => {
            let result = items.map((item) => {
                let user = users.find((user) => { return user.id === item.message.user_id });
                let conversationText = item.message.body;
                let conversationPhoto = item.message.photo_50;
                let conversationTitle = item.message.title;
                let isConversationRead = item.message.read_state;
                let isMyMessage = item.message.out;
                let date = new Date(item.message.date * 1000);

                if (conversationTitle === ' ... ' || conversationTitle === '') {
                    conversationTitle = (user && user.fullName);
                }

                return new VKConversation(this.loginID, {
                    id: item.message.id,
                    userID: item.message.user_id,
                    chatID: item.message.chat_id,
                    date: date,
                    conversationTitle: conversationTitle,
                    conversationText: conversationText,
                    conversationPhoto: conversationPhoto || (user && user.conversationPhoto),
                    isConversationRead: isConversationRead,
                    isMyMessage: isMyMessage
                });
            });
            callback(result);
        });
    }

}

module.exports = VKConversationsClient;
