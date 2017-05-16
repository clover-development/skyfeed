const ConversationsClient = require('../base/conversaions-client');

class TwitterConversationsClient extends ConversationsClient {
    constructor(loginID) {
        super(loginID);
    }

    getDialogs(callback) {
        console.log('yo from tw get dialogs');

        let params = { count: 200 };

        let incoming = null;
        let outgoing = null;

        this.getAPIClient().get('direct_messages', params, function (error, messages) {
            console.log(messages);
            if (!(messages || messages.length)) { incoming = []; }
            incoming = messages;

            this.processMessages(incoming, outgoing, callback);
        });
        this.getAPIClient().get('direct_messages/sent', params, function (error, messages) {
            console.log(messages);
            if (!(messages || messages.length)) { outgoing = []; }
            outgoing = messages;

            this.processMessages(incoming, outgoing, callback);
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

        let merged = [];
        merged.push(...incoming);
        merged.push(...outgoing);

        let conversations = {};
        let sobesedniki = [];

        merged.forEach((rawMessage) => {

        });

    }
}

module.exports = TwitterConversationsClient;
