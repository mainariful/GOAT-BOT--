const axios = require("axios");

module.exports = {
  config: {
    name: "rmv",
    version: "1.0",
    author: "S AY EM",
    countDown: 5,
    role: 2,
    category: "ai"
  },

  onStart: async function ({ api, event, args }) {
    try {

      const question = args.join(" ");

      if (!question) {
        return api.sendMessage(
          "⚠️ | Please provide a question to remove!\nExample: rmv hello",
          event.threadID,
          event.messageID
        );
      }

      const API_URL = `https://sayem-baby-apixs.up.railway.app/teachrmv?ask=${encodeURIComponent(question)}`;

      const res = await axios.get(API_URL);

      const data = res.data;

      if (data.err) {
        return api.sendMessage(
          `❌ | ${data.err}`,
          event.threadID,
          event.messageID
        );
      }

      api.sendMessage(
        `✅ | Question Removed Successfully!\n\n🗑️ Removed: ${data.question}`,
        event.threadID,
        event.messageID
      );

    } catch (err) {
      api.sendMessage(
        `❌ | API Error: ${err.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};