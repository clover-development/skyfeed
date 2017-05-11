const VKApi = require('node-vkapi');
const Client = require('./client');
const VKPost = require('../posts/vk-post');

class VKClient extends Client {
    constructor(args) {
        super(args);
        if (!args.token) {
            throw new Error('Token is required');
        }
        this.apiClient = new VKApi({ token : args.token });
        this.token = args.token;
        this.id = this.token;
        this.type = 'vk';
    }

    getAttributes() {
      let result = this.getCommonAttributes();
      result.token = this.token;
      return result;
    }

    getPosts(page = 0, callback) {
        let params = {
            filters: 'post',
            start_from: this.nextFromPosts || ''
        };
        this.apiClient.call('newsfeed.get', params).then(res => {
            this.nextFromPosts = res.next_from;
            let posts = this.parsePosts(res.items, res.groups, res.profiles);
            callback(posts);
        });
    }

    parsePosts(items, groups, profiles) {
        return items.map((item) => {
            let source_id = parseInt(item.source_id);
            let origin;
            if (source_id > 0) {
                origin = profiles.find((p) => { return parseInt(p.id) === source_id });
            } else {
                origin = groups.find((g) => { return parseInt(g.id) === -source_id });
            }
            let originPhoto = origin.photo_100;
            let originName = origin.screen_name;
            let postText = item.text;
            let postDate = new Date(item.date * 1000);

            return new VKPost(this, {
                id: item.post_id,
                originPhoto: originPhoto,
                originName: originName,
                postText: postText,
                postDate: postDate
            });
        }).filter((item) => {
            return !!item.text;
        });
    }
}

module.exports = VKClient;
