const axios = require("axios");

module.exports = {
  config: {
    name: "p",
    version: "1.1",
    author: "@RI F AT",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate AI image prompt from image"
    },
    longDescription: {
      en: "Generate a detailed AI prompt from an image using your deployed API"
    },
    category: "ai",
    guide: {
      en: "{pn}\nReply to an image with this command."
    }
  },

  onStart: async function ({ message, event }) {
    if (
      !event.messageReply ||
      !event.messageReply.attachments?.[0]?.type?.startsWith("photo")
    ) {
      return message.reply("Please reply to an image to generate a prompt.");
    }

    const imgURL = event.messageReply.attachments[0].url;
    const apiUrl = `https://rifatapiv3.vercel.app/api/tool/prompt?img=${encodeURIComponent(imgURL)}`;

    try {
      const res = await axios.get(apiUrl);

      // ✅ Updated response handling
      if (res.data?.status && res.data?.result) {
        return message.reply(res.data.result);
      } else {
        return message.reply("API did not return a valid prompt.");
      }

    } catch (err) {
      console.error("Prompt fetch error:", err.message);
      return message.reply("Failed to generate prompt. Please try again later.");
    }
  }
};