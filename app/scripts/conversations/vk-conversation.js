const Conversation = require('./conversation');

class VKConversation extends Conversation {
    constructor(client, attrs) {
      super();
      this.client = client;
      this.id = attrs.id;
      this.conversationTitle = attrs.conversationTitle;
      this.conversationText = attrs.conversationText;
      this.conversationPhoto = attrs.conversationPhoto;
    }
}

module.exports = VKConversation;
