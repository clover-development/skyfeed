const VKApi = require('node-vkapi');
const Client = require('./client');
const VKPost = require('../posts/vk-post');
const VKConversation = require('../conversations/vk-conversation');
const VKPhotoParser = require('../toolkit/vk-photo-parser');

class VKClient extends Client {
    constructor(args) {
        super(args);
        if (!args.token) throw new Error('Token is required');
        this.apiClient = new VKApi({ token : args.token });
        this.token = args.token;
        this.id = this.token;
        this.type = 'vk';
        this.offset = 0;
    }

    getAttributes() {
        let result = this.getCommonAttributes();
        result.token = this.token;
        return result;
    }

    getUsers(userIDs, callback) {
        let params = {
            user_ids: userIDs.join(', '),
            fields: 'photo_50'
        };

        this.apiClient.call('users.get', params).then(res => {
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

    _parseBasicPostData (postData, idField, sourceIDField, profiles, groups) {
        let sourceID = parseInt(postData[sourceIDField]);
        let origin;
        if (sourceID > 0) {
            origin = profiles.find((p) => { return parseInt(p.id) === sourceID });
        } else {
            origin = groups.find((g) => { return parseInt(g.id) === -sourceID });
        }
        let originPhoto = origin.photo_100;
        let originName = origin.screen_name;
        let text = postData.text;
        let date = new Date(postData.date * 1000);

        let photos = VKPhotoParser.parse(postData.attachments || [], 807);

        return {
            id: postData[idField],
            sourceID: sourceID,
            originPhoto: originPhoto,
            originName: originName,
            postText: text,
            postDate: date,
            photos: photos
        }
    }

    parsePosts(items, groups, profiles) {
        return items.map((item) => {
            let attributes = {
                liked: parseInt(item.likes.user_likes) === 1,
                likesCount: parseInt(item.likes.count)
            };

            let basicProperties = this._parseBasicPostData(item, 'post_id', 'source_id', profiles, groups);

            let copyHistory = (item.copy_history || []).map((copy) => {
                return this._parseBasicPostData(copy, 'id', 'from_id', profiles, groups)
            });

            Object.assign(attributes, basicProperties, { copyHistory: copyHistory });

            return new VKPost(this, attributes);
        });
    }

    getDialogs(callback) {
        let params = {
          count: 50,
          offset: this.offset,
          preview_length: 100
        }

        this.apiClient.call('messages.getDialogs', params).then(res => {
            this.offset += 50;
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
                let conversationPhoto = item.message.photo_50;
                let conversationTitle = item.message.title;
                let isConversationRead = item.message.read_state;
                let isMyMessage = item.message.out;

                if (conversationTitle === ' ... ' || conversationTitle === '') {
                    conversationTitle = (user && user.fullName);
                }

                return new VKConversation(this, {
                    id: item.message.id,
                    userID: item.message.user_id,
                    chatID: item.message.chat_id,
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

module.exports = VKClient;
