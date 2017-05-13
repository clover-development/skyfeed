class Post {
    constructor(client, attrs) {
        this.client = client;
        this.apiClient = client.apiClient;
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
