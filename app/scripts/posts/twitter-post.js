const Post = require('./post');

class TwitterPost extends Post {

    constructor(client, args) {
        super(client, args);
        this.isBeingLiked = false;
        console.log(this);
    }

    switchLike(callback) {
        if (this.isBeingLiked) { return }

        let params = { id: this.id, include_entities: false };

        this.isBeingLiked = true;
        let method = this.liked ? 'favorites/destroy' : 'favorites/create';

        this.apiClient.post(method, params, (error, tweet, response) => {
            this.isBeingLiked = false;
            if (!!error) { console.log('Twitter like error: ', error); callback(error, this) }

            this.liked = tweet.favorited;
            this.likesCount = tweet.favorite_count;
            callback(null, this);
        })
    }
}

module.exports = TwitterPost;
