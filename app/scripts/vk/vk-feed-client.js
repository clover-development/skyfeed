const FeedClient = require('../base/feed-client');
const VKPhotoParser = require('./vk-photo-parser');
const VKPost = require('./vk-post');

class VKFeedClient extends FeedClient {
    constructor(loginID) {
        super(loginID);
    }

    getPosts(callback) {
        let params = {
            filters: 'post',
            start_from: this.nextFromPosts || '',
            count: 50
        };
        this.getAPIClient().call('newsfeed.get', params).then(res => {
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

            return new VKPost(this.loginID, attributes);
        });
    }
}

module.exports = VKFeedClient;
