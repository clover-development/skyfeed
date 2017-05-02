const {remote} = require('electron');
const isRenderer = require('is-electron-renderer');

if (!isRenderer) {
    global.sharedState = {};
}

let state;

if (isRenderer) {
    state = remote.getGlobal('sharedState');
} else {
    state = global.sharedState;
}

module.exports = state;
