const VKApi = require('node-vkapi');
const randomColor = require('randomcolor');
const Client = require('./client');

class VKClient extends Client {
    constructor(args) {
        super();
        if (!args.token) {
            throw new Error('Token is required');
        }
        this.token = args.token;
        this.apiClient = new VKApi({ token : args.token });
        this.type = 'vk';
        this.color = args.color || randomColor();
    }

    getPosts(page = 0, callback) {
        this.apiClient.call('newsfeed.get', {}).then(res => {
            callback(res.items);
        });
    }

    getAttributes() {
        return {
            token: this.token,
            color: this.color,
            klass: this.constructor.name
        }
    }

    htmlColor() {
        return {
            'color': this.color
        };
    }
}

module.exports = VKClient;
