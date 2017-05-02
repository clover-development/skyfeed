const {Client} = require('./client');

class VKClient extends Client {

    getPosts(page = 0, callback) {
        this.apiClient.call('newsfeed.get', {}).then(res => {
            callback(res.items);
        });
    }
}

module.exports.VKClient = VKClient;
