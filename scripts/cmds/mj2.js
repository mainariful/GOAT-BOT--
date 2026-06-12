const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const sharp = require("sharp");

module.exports = {
  config: {
    name: "mj2",
    version: "2.2",
    author: "RIFAT",
    countDown: 6,
    category: "ai",
    description: "Generate high-quality Midjourney images using new API"
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ");
    if (!prompt) return;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const apiUrl = `https://gayjourney.onrender.com/mj?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data || data.success !== true || !Array.isArray(data.images)) {
        throw new Error("Invalid API Response");
      }

      const results = data.images.map(img => img.final);

      if (results.length < 4) {
        throw new Error("Insufficient images returned");
      }

      const buffers = await Promise.all(
        results.slice(0, 4).map(async (url) => {
          const img = await axios.get(url, { responseType: "arraybuffer" });
          return Buffer.from(img.data);
        })
      );

      const meta = await sharp(buffers[0]).metadata();
      const w = meta.width;
      const h = meta.height;

      const grid = await sharp({
        create: {
          width: w * 2,
          height: h * 2,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
        .composite([
          { input: buffers[0], left: 0, top: 0 },
          { input: buffers[1], left: w, top: 0 },
          { input: buffers[2], left: 0, top: h },
          { input: buffers[3], left: w, top: h }
        ])
        .png()
        .toBuffer();

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const filePath = path.join(cacheDir, `mmj_${event.senderID}.png`);
      fs.writeFileSync(filePath, grid);

      return api.sendMessage(
        {
          body: "Midjourney Result\nReply with U1, U2, U3, or U4 to upscale.",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        (err, info) => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          if (err) return;

          api.setMessageReaction("✅", event.messageID, () => {}, true);

          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            urls: results
          });
        },
        event.messageID
      );

    } catch (err) {
      console.error("MMJ ERROR:", err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  },

  onReply: async function ({ api, event, Reply, message }) {
    const { author, urls } = Reply;
    if (event.senderID !== author) return;

    const choice = event.body.trim().toUpperCase();
    const map = { U1: 0, U2: 1, U3: 2, U4: 3 };

    if (!(choice in map)) return;

    try {
      api.setMessageReaction("⏬", event.messageID, () => {}, true);

      const imgUrl = urls[map[choice]];
      const res = await axios.get(imgUrl, { responseType: "arraybuffer" });

      const filePath = path.join(__dirname, "cache", `up_${event.senderID}.png`);
      fs.writeFileSync(filePath, Buffer.from(res.data));

      api.sendMessage(
        {
          body: `✨ Image ${choice}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        },
        event.messageID
      );

    } catch (e) {
      console.error("UPSCALE ERROR:", e.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};