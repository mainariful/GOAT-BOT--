const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

const GBAN_PATH = path.join(process.cwd(), "database", "global_bans.json");

function loadBans() {
  try {
    return fs.existsSync(GBAN_PATH) ? JSON.parse(fs.readFileSync(GBAN_PATH, "utf8")) : {};
  } catch { return {}; }
}

function saveBans(data) {
  fs.writeFileSync(GBAN_PATH, JSON.stringify(data, null, 2), "utf8");
  global.Anchestor.globalBans = data;
}

module.exports = {
  config: {
    name: "gban",
    version: "1.0",
    author: "xemonbae01",
    countDown: 3,
    role: 2,
    description: {
      en: "Globally ban / unban a user across all groups"
    },
    category: "admin",
    guide: {
      en: "   {pn} add [@tag|uid] [reason] — globally ban a user\n"
        + "   {pn} remove [@tag|uid] — remove global ban\n"
        + "   {pn} check [@tag|uid] — check if a user is globally banned\n"
        + "   {pn} list [page] — list all globally banned users"
    }
  },

  langs: {
    en: {
      noTarget: "⚠️ | Please tag a user, reply to their message, or provide their UID.",
      cantBanSelf: "⚠️ | You cannot globally ban yourself.",
      cantBanAdmin: "❌ | You cannot globally ban a bot admin.",
      alreadyBanned: "❌ | This user is already globally banned.\n» UID: %1\n» Reason: %2\n» Time: %3",
      bannedSuccess: "✅ | Successfully globally banned:\n» Name: %1\n» UID: %2\n» Reason: %3\n» Time: %4",
      notBanned: "⚠️ | UID %1 is not in the global ban list.",
      unbannedSuccess: "✅ | Global ban removed for UID %1.",
      noData: "📑 | The global ban list is empty.",
      listHeader: "⛔ GLOBAL BAN LIST (page %1/%2)\n──────────────────────────\n",
      listEntry: "%1. %2 (%3)\n   Reason: %4\n   Time: %5\n\n",
      checkBanned: "⛔ | UID %1 is GLOBALLY BANNED.\n» Reason: %2\n» Time: %3",
      checkClean: "✅ | UID %1 is not globally banned.",
      noReason: "No reason provided"
    }
  },

  onStart: async function ({ message, event, args, usersData, getLang, api }) {
    const { senderID } = event;
    const adminBot = global.Anchestor.config.adminBot || [];
    const tz = global.Anchestor.config.timeZone || "Asia/Dhaka";
    const sub = (args[0] || "").toLowerCase();

    if (sub === "list") {
      const bans = loadBans();
      const entries = Object.entries(bans);
      if (!entries.length) return message.reply(getLang("noData"));

      const PAGE_SIZE = 10;
      const page = Math.max(1, parseInt(args[1]) || 1);
      const totalPages = Math.ceil(entries.length / PAGE_SIZE);
      const slice = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

      let body = getLang("listHeader", page, totalPages);
      slice.forEach(([uid, info], i) => {
        body += getLang("listEntry",
          (page - 1) * PAGE_SIZE + i + 1,
          info.name || "Unknown",
          uid,
          info.reason || getLang("noReason"),
          info.time
        );
      });
      return message.reply(body.trim());
    }

    if (sub === "check") {
      let target = args[1];
      if (!target && event.messageReply?.senderID) target = event.messageReply.senderID;
      if (!target && Object.keys(event.mentions || {}).length)
        target = Object.keys(event.mentions)[0];
      if (!target) return message.reply(getLang("noTarget"));
      target = String(target);

      const bans = loadBans();
      if (bans[target]) {
        return message.reply(getLang("checkBanned", target, bans[target].reason || getLang("noReason"), bans[target].time));
      }
      return message.reply(getLang("checkClean", target));
    }

    if (sub === "remove" || sub === "unban") {
      let target = args[1];
      if (!target && event.messageReply?.senderID) target = event.messageReply.senderID;
      if (!target && Object.keys(event.mentions || {}).length)
        target = Object.keys(event.mentions)[0];
      if (!target) return message.reply(getLang("noTarget"));
      target = String(target);

      const bans = loadBans();
      if (!bans[target]) return message.reply(getLang("notBanned", target));
      delete bans[target];
      saveBans(bans);
      return message.reply(getLang("unbannedSuccess", target));
    }

    let target, reason;

    if (event.messageReply?.senderID) {
      target = String(event.messageReply.senderID);
      reason = args.slice(sub === "add" ? 1 : 0).join(" ").trim();
    } else if (Object.keys(event.mentions || {}).length) {
      target = String(Object.keys(event.mentions)[0]);
      const mentionText = event.mentions[target] || "";
      reason = (sub === "add" ? args.slice(1) : args)
        .join(" ").replace(mentionText, "").trim();
    } else if (!isNaN(sub === "add" ? args[1] : sub)) {
      target = String(sub === "add" ? args[1] : sub);
      reason = args.slice(sub === "add" ? 2 : 1).join(" ").trim();
    } else {
      return message.reply(getLang("noTarget"));
    }

    if (!target) return message.reply(getLang("noTarget"));
    if (target === senderID) return message.reply(getLang("cantBanSelf"));
    if (adminBot.includes(target)) return message.reply(getLang("cantBanAdmin"));

    const bans = loadBans();
    if (bans[target]) {
      return message.reply(getLang("alreadyBanned", target, bans[target].reason || getLang("noReason"), bans[target].time));
    }

    let name = "Unknown";
    try { name = await usersData.getName(target) || name; } catch {}

    const time = moment().tz(tz).format("HH:mm:ss DD/MM/YYYY");
    bans[target] = {
      name,
      reason: reason || getLang("noReason"),
      time,
      bannedBy: senderID
    };
    saveBans(bans);

    return message.reply(getLang("bannedSuccess", name, target, reason || getLang("noReason"), time));
  }
};
