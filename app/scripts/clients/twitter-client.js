const Twitter = require('twitter');
const Client = require('./client');

class TwitterClient extends Client {
  constructor(args) {
    super(args);

    if (!args.token) {
        throw new Error('Token is required');
    }

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
    let params = {screen_name: 'nodejs'};
    this.apiClient.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(tweets);
        callback(tweets);
      }
      console.log(error, tweets);
    });
  }
}

module.exports = TwitterClient;
