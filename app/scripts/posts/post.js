class Post {
    constructor(client, attrs) {
        this.client = client;
        this.id = attrs.id;
        this.text = attrs.postText;
        this.date = attrs.postDate;
        this.originPhoto = attrs.originPhoto;
        this.originName = attrs.originName;
        this.liked = attrs.liked;
        this.likesCount = attrs.likesCount;
    }
}

module.exports = Post;
