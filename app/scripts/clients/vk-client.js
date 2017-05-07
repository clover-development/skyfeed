const VKApi = require('node-vkapi');
const Client = require('./client');

class VKClient extends Client {
    constructor(args) {
        super(args);
        this.apiClient = new VKApi({ token : args.token });
        this.type = 'vk';
    }

    getPosts(page = 0, callback) {
        this.apiClient.call('newsfeed.get', {filters: 'post'}).then(res => {
            callback(res.items);
        });
    }
}

module.exports = VKClient;
