const Post = require('./post');

class TwitterPost extends Post {
    constructor(client, attrs) {
      super();
      this.client = client;
      this.id = attrs.id;
      this.text = attrs.postText;
      this.date = attrs.postDate;
      this.originPhoto = attrs.originPhoto;
      this.originName = attrs.originName;
    }
}

module.exports = TwitterPost;
