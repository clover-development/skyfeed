const Twitter = require('twitter');
const Client = require('./client');
const TwitterPost = require('../posts/twitter-post');
const TwitterPhotosParser = require('../toolkit/twitter-photo-parser');

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

        this.type = 'twitter';
    }

    getAttributes() {
        let result = this.getCommonAttributes();
        result.token = this.token;
        result.tokenSecret = this.tokenSecret;
        return result;
    }

    getPosts(page = 0, callback) {
        let _this = this;

        let maxCount = 100;
        let params = {count: maxCount};
        if (this.lastID) {
            params.max_id = this.lastID - 1;
        }

        this.apiClient.get('statuses/home_timeline', params, function (error, tweets, response) {
            if (error) {
                console.log('Twitter Posts Error:\n', error);
                callback([]);
                return
            }
            if (_this.isLastPage) {
                callback([]);
                return
            }

            let count = tweets.length;
            if (count < maxCount) {
                _this.isLastPage = true;
            }

            let posts = _this.parsePosts(tweets);
            _this.lastID = tweets[tweets.length - 1].id;

            callback(posts);
        });
    }

    parsePosts(items) {
        return items.map((item) => {
            let attributes = {
                liked: item.favorited,
                likesCount: item.favorite_count
            };

            let basicProperties = this._parseBasicPostData(item);

            let copyHistory = [];
            if (item.retweeted_status) {
                basicProperties.postText = '';
                copyHistory.push(this._parseBasicPostData(item.retweeted_status));
            }

            Object.assign(attributes, basicProperties, {copyHistory: copyHistory});

            return new TwitterPost(this, attributes);
        });
    }

    _parseBasicPostData(postData) {
        let postText = postData.text;
        let postDate = new Date(postData.created_at.replace(/-/g, "/"));
        let originPhoto = postData.user.profile_image_url;
        let originName = postData.user.name;

        let photos = TwitterPhotosParser.parse(postData.entities.media);

        return {
            id: postData.id_str,
            originPhoto: originPhoto,
            originName: originName,
            postText: postText,
            postDate: postDate,
            photos: photos
        }
    }
}

module.exports = TwitterClient;
