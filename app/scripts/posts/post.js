const loginService = require('../login-service-renderer');

class Post {
    constructor(loginID, attrs) {
        this.loginID = loginID;
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

    getLogin() {
        return loginService.findLogin(this.loginID)
    }

    getAPIClient() {
        return this.getLogin().apiClient;
    }
}

module.exports = Post;
