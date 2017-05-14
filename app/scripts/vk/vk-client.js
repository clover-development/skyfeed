const VKApi = require('node-vkapi');
const Client = require('../base/client');
const VKConversationsClient = require('./vk-conversations-client');
const VKFeedClient = require('./vk-feed-client');

class VKClient extends Client {
    constructor(args) {
        super(args);
        if (!args.token) throw new Error('Token is required');
        this.apiClient = new VKApi({ token : args.token });
        this.token = args.token;
        this.id = this.token;
        this.type = 'vk';

        this.conversationsClient = new VKConversationsClient(this.id);
        this.feedClient = new VKFeedClient(this.id);
    }

    getAttributes() {
        let result = this.getCommonAttributes();
        result.token = this.token;
        return result;
    }

    getPosts(page = 0, callback) {
       this.feedClient.getPosts(callback);
    }

    getDialogs(callback) {
        this.conversationsClient.getDialogs(callback);
    }
}

module.exports = VKClient;
