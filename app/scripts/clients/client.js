const randomColor = require('randomcolor');

class Client {
    constructor(args) {
        this.color = args.color || randomColor();
        this.active = true;
    }

    // This function fetches the posts from users news feed
    getPosts(page = 0, callback) { }

    getCommonAttributes() {
        return {
            color: this.color,
            klass: this.constructor.name
        }
    }

    htmlColor() {
        return { 'color': this.color };
    }

    switchActive() {
        this.active = !this.active;
    }
}

module.exports = Client;
