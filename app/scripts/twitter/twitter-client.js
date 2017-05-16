const Twitter = require('twitter');
const Client = require('../base/client');
const TwitterConversationsClient = require('./twitter-conversations-client');
const TwitterFeedClient = require('./twitter-feed-client');

class TwitterClient extends Client {
    constructor(args) {
        super(args);
        if (!args.token || !args.tokenSecret) throw new Error('Token is required');
        this.token = args.token;
        this.tokenSecret = args.tokenSecret;
        this.id = this.token;

        this.apiClient = new Twitter({
            consumer_key: 'H0qR6Rf3ijBilTF25Js8RnnLB',
            consumer_secret: 'b6sNgLUvVZMomLNRsFmLIbNXIJ9qM8t2Hr13Tf6PSdP7IwHUaa',
            access_token_key: args.token,
            access_token_secret: args.tokenSecret
        });

        this.conversationsClient = new TwitterConversationsClient(this.id);
        this.feedClient = new TwitterFeedClient(this.id);

        this.type = 'twitter';
    }

    getAttributes() {
        let result = this.getCommonAttributes();
        result.token = this.token;
        result.tokenSecret = this.tokenSecret;
        return result;
    }

    getPosts(page = 0, callback) {
        this.feedClient.getPosts(callback);
    }

    getDialogs(callback) {
        this.conversationsClient.getDialogs(callback);
    }
}

module.exports = TwitterClient;
