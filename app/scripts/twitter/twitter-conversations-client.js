const ConversationsClient = require('../base/conversaions-client');
const TwitterConversation = require('../twitter/twitter-conversation');

class TwitterConversationsClient extends ConversationsClient {
    constructor(loginID) {
        super(loginID);
        this.resetPage();
    }

    resetPage() {
        this.fetched = false;
    }

    getDialogs(callback) {
        if (this.fetched) { callback([]); return}
        let self = this;
        let params = { count: 200 };

        let incoming = null;
        let outgoing = null;

        this.getAPIClient().get('direct_messages', params, function (error, messages) {
            if (!(messages || messages.length)) { incoming = []; }
            incoming = messages;

            self.processMessages(incoming, outgoing, callback);
        });
        this.getAPIClient().get('direct_messages/sent', params, function (error, messages) {
            if (!(messages || messages.length)) { outgoing = []; }
            outgoing = messages;

            self.processMessages(incoming, outgoing, callback);
        });
    }

    processMessages(incoming, outgoing, callback) {
        if (incoming === null || outgoing === null) { return }

        let me = null;
        if (incoming.length) {
            let firstMessage = incoming[0];
            me = {
                id: firstMessage.recipient_id_str,
                screenName: firstMessage.recipient_screen_name,
            }
        } else if (outgoing.length) {
            let firstMessage = outgoing[0];
            me = {
                id: firstMessage.recipient_id_str,
                screenName: firstMessage.recipient_screen_name
            }
        }

        let conversations = {};

        incoming.forEach((rawMessage) => {
            let sobesednikID = rawMessage.sender_id_str;
            if (!conversations[sobesednikID]) { conversations[sobesednikID] = [] }
            rawMessage.isMyMessage = false;
            conversations[sobesednikID].push(rawMessage);
        });
        outgoing.forEach((rawMessage) => {
            let sobesednikID = rawMessage.recipient_id_str;
            if (!conversations[sobesednikID]) { conversations[sobesednikID] = [] }
            rawMessage.isMyMessage = true;
            conversations[sobesednikID].push(rawMessage);
        });

        let parsedConversations = [];

        for (let sobesednikID in conversations) {
            let conversationMessages = conversations[sobesednikID];

            let message = conversationMessages[0];

            let conversationAttributes = null;

            if (message.isMyMessage) {
                let sobesednik = message.recipient;

                conversationAttributes = {
                    id: sobesednikID,
                    conversationTitle: sobesednik.screen_name,
                    conversationPhoto: sobesednik.profile_image_url,
                    isConversationRead: true,
                    isMyMessage: true
                }
            } else {
                let sobesednik = message.sender;

                conversationAttributes = {
                    id: sobesednikID,
                    conversationTitle: sobesednik.screen_name,
                    conversationPhoto: sobesednik.profile_image_url,
                    isConversationRead: true,
                    isMyMessage: true
                }
            }

            let messages = conversationMessages.map((rawMessage) => {
                return {
                    id: rawMessage.id_str,
                    text: rawMessage.text,
                    isMyMessage: rawMessage.isMyMessage,
                    date: new Date(rawMessage.created_at),
                    photos: []
                }
            });

            messages = messages.sort((a, b) => { return b.date - a.date });

            conversationAttributes.conversationText = messages[0].text;
            conversationAttributes.date = messages[0].date;
            conversationAttributes.messages = messages;

            parsedConversations.push(new TwitterConversation (this.loginID, conversationAttributes));
        }
        this.fetched = true;
        parsedConversations = parsedConversations.sort((a, b) => { return b.date - a.date });

        callback(parsedConversations);
    }
}

module.exports = TwitterConversationsClient;
