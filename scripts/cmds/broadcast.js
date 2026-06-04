const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "broadcast",
    version: "1.0",
    author: "xemonbae01",
    countDown: 10,
    role: 2,
    description: {
      en: "Send a message to all groups the bot is currently in"
    },
    category: "admin",
    guide: {
      en: "   {pn} <message> — broadcast to all groups\n"
        + "   {pn} -img <message> — broadcast with replied image\n"
        + "   {pn} -preview — count how many groups will receive the broadcast"
    }
  },

  langs: {
    en: {
      noMessage: "⚠️ | Please provide a message to broadcast.",
      preview: "📡 | Bot is currently in %1 group(s). Use -broadcast <message> to send.",
      sending: "📡 | Broadcasting to %1 group(s)...",
      done: "✅ | Broadcast complete.\n» Sent: %1\n» Failed: %2\n» Total: %3\n» Time: %4",
      header: "📢 ANCHESTOR BROADCAST\n──────────────────────\n",
      footer: "\n──────────────────────\n📅 %1"
    }
  },

  onStart: async function ({ message, event, args, getLang, api }) {
    const threads = global.db.allThreadData.filter(t => t.threadID && t.isGroup !== false);
    const tz = global.Anchestor.config.timeZone || "Asia/Dhaka";

    if (args[0] === "-preview") {
      return message.reply(getLang("preview", threads.length));
    }

    const text = args.join(" ").trim();
    if (!text) return message.reply(getLang("noMessage"));

    const timestamp = moment().tz(tz).format("HH:mm:ss DD/MM/YYYY");
    const body = getLang("header") + text + getLang("footer", timestamp);

    await message.reply(getLang("sending", threads.length));

    let sent = 0, failed = 0;
    const startMs = Date.now();

    const hasAttachment = event.messageReply?.attachments?.length > 0;

    for (const thread of threads) {
      try {
        if (hasAttachment) {
          await api.sendMessage(
            { body, attachment: event.messageReply.attachments },
            thread.threadID
          );
        } else {
          await api.sendMessage(body, thread.threadID);
        }
        sent++;
        await new Promise(r => setTimeout(r, 400));
      } catch {
        failed++;
      }
    }

    const elapsed = ((Date.now() - startMs) / 1000).toFixed(1) + "s";
    return message.reply(getLang("done", sent, failed, threads.length, elapsed));
  }
};
