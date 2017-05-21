const randomColor = require('randomcolor');

class Client {
    constructor(args) {
        this.color = args.color || randomColor();
        this.active = true;
    }

    getPosts(page = 0, callback) {
      callback([])
    }

    getDialogs(callback) { callback([]) }

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
