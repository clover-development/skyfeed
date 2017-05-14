const Post = require('../base/post');
const unirest = require('unirest');

class VKPost extends Post {

    constructor(loginID, args) {
        super(loginID, args);
        this.sourceID = args.sourceID;
        this.isBeingLiked = false;
    }

    switchLike(callback) {
        if (this.isBeingLiked) { return }

        let params = { type: 'post', item_id: this.id, owner_id: this.sourceID };

        this.isBeingLiked = true;
        if (this.liked) {
            this._deleteLike(params, callback);
        } else {
            this._addLike(params, callback);
        }
    }

    _addLike(params, callback) {
        this.getAPIClient().call('likes.add', params).then((res) => {
            this.liked = true;
            this.likesCount = res.likes;
            this.isBeingLiked = false;
            callback(null, this);
        }).catch((error) => {
            console.log('Add Like Error: ', error);
            this.isBeingLiked = false;
            callback(error, this);
        });
    }

    _deleteLike(params, callback) {
        this.getAPIClient().call('likes.delete', params).then((res) => {
            this.liked = false;
            this.likesCount = res.likes;
            this.isBeingLiked = false;
            callback(null, this);
        }).catch((error) => {
            console.log('Remove Like Error: ', error);
            this.isBeingLiked = false;
            callback(error, this);
        });
    }
}

module.exports = VKPost;
