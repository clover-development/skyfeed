const LoginIdentifiable = require('./login-identefiable');

class Post extends LoginIdentifiable {
    constructor(loginID, attrs) {
        super(loginID);
        this.id = attrs.id;
        this.text = attrs.postText;
        this.date = attrs.postDate;
        this.originPhoto = attrs.originPhoto;
        this.originName = attrs.originName;
        this.liked = attrs.liked;
        this.likesCount = attrs.likesCount;
        this.photos = attrs.photos;
        this.copyHistory = attrs.copyHistory;
    }
}

module.exports = Post;
