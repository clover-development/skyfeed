const Twitter = require('twitter');
const Client = require('./client');
const TwitterPost = require('../posts/twitter-post');

class TwitterClient extends Client {
  constructor(args) {
    super(args);
    if (!args.token) throw new Error('Token is required');
    this.token = args.token;
    this.tokenSecret = args.tokenSecret;

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
    let params = { count: maxCount };
    if (this.lastID) { params.max_id = this.lastID - 1; }

    this.apiClient.get('statuses/home_timeline', params, function(error, tweets, response) {
      if (error) { console.log('Twitter Posts Error:\n', error); return }
      if (_this.isLastPage) { return }

      let count = tweets.length;
      if (count < maxCount) { _this.isLastPage = true; }

      let posts = _this.parsePosts(tweets);
      _this.lastID = tweets[tweets.length - 1].id;

      callback(posts);
    });
  }

  parsePosts(items) {
      return items.map((item) => {
        let postText = item.text;
        let postDate = new Date(item.created_at.replace(/-/g,"/"));
        let originPhoto = item.user.profile_image_url;
        let originName = item.user.name;

        return new TwitterPost(this, {
            id: item.id,
            originPhoto: originPhoto,
            originName: originName,
            postText: postText,
            postDate: postDate
        });
      });
  }
}

module.exports = TwitterClient;
