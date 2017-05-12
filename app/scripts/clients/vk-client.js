const VKApi = require('node-vkapi');
const Client = require('./client');
const VKPost = require('../posts/vk-post');
const VKConversation = require('../conversations/vk-conversation');

class VKClient extends Client {
    constructor(args) {
        super(args);
        if (!args.token) throw new Error('Token is required');
        this.apiClient = new VKApi({ token : args.token });
        this.token = args.token;
        this.id = this.token;
        this.type = 'vk';
    }

    getUsers(userIds, callback) {
        let params = {
            user_ids: userIds.join(', '),
            fields: 'photo_100'
        };

        this.apiClient.call('users.get', params).then(res => {
            let result = res.map((item) => {
                let fullName = `${item.first_name} ${item.last_name}`;
                let conversationPhoto = item.photo_100;
                return {
                  id: item.id,
                  fullName: fullName,
                  conversationPhoto: conversationPhoto
                }
            });
            callback(result);
        });
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
            let sourceID = parseInt(item.source_id);
            let origin;
            if (sourceID > 0) {
                origin = profiles.find((p) => { return parseInt(p.id) === sourceID });
            } else {
                origin = groups.find((g) => { return parseInt(g.id) === -sourceID });
            }
            let originPhoto = origin.photo_100;
            let originName = origin.screen_name;
            let postText = item.text;
            let postDate = new Date(item.date * 1000);

            return new VKPost(this, {
                id: item.post_id,
                sourceID: sourceID,
                originPhoto: originPhoto,
                originName: originName,
                postText: postText,
                postDate: postDate,
                liked: parseInt(item.likes.user_likes) === 1,
                likesCount: parseInt(item.likes.count)
            });
        }).filter((item) => {
            return !!item.text;
        });
    }

    getDialogs(callback) {
        this.apiClient.call('messages.getDialogs', {count: 100, offset: 0, preview_length: 100}).then(res => {
            this.parseDialogs(res.items, (parsedDialogs) => {
                callback(parsedDialogs);
            });
        });
    }

    parseDialogs(items, callback) {
        let userIds = items.map((item) => { return item.message.user_id });
        this.getUsers(userIds, (users) => {
            let result = items.map((item) => {
                let user = users.find((user) => { return user.id === item.message.user_id });
                let conversationText = item.message.body;
                let conversationPhoto = item.message.photo_100;
                let conversationTitle = item.message.title;

                if (conversationTitle === ' ... ' || conversationTitle === '') {
                    conversationTitle = (user && user.fullName);
                }

                return new VKConversation(this, {
                    id: item.message.id,
                    userID: item.message.user_id,
                    conversationTitle: conversationTitle,
                    conversationText: conversationText,
                    conversationPhoto: conversationPhoto || (user && user.conversationPhoto)
                });
            });
            callback(result);
        });
    }

    parseMessages(items, callback) {
        let result = items.map((item) => {
            let conversationText = item.body;
            let conversationTitle = item.title;

            return {
                id: item.id,
                userID: item.user_id,
                text: item.body,
            }
        });
        callback(result);
    }

    getMessages(userID, callback) {
        this.apiClient.call('messages.getHistory', { count: 100, user_id: userID }).then(res => {
            this.parseMessages(res.items, (parsedDialogs) => {
                console.log(parsedDialogs);
                callback(parsedDialogs);
            });
        });
    }
}

module.exports = VKClient;
