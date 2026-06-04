const path = require("path");
const fs = require("fs-extra");

const MAINT_PATH = path.join(process.cwd(), "database", "maintenance.json");

function loadState() {
  try {
    return fs.existsSync(MAINT_PATH) ? JSON.parse(fs.readFileSync(MAINT_PATH, "utf8")) : { enable: false, message: "" };
  } catch { return { enable: false, message: "" }; }
}

function saveState(state) {
  fs.writeFileSync(MAINT_PATH, JSON.stringify(state, null, 2));
  global.Anchestor.maintenance = state;
}

module.exports = {
  config: {
    name: "maintenance",
    version: "1.0",
    author: "xemonbae01",
    countDown: 3,
    role: 2,
    description: {
      en: "Toggle bot maintenance mode — blocks all commands for non-admins"
    },
    category: "admin",
    guide: {
      en: "   {pn} on [message] — enable maintenance mode\n"
        + "   {pn} off — disable maintenance mode\n"
        + "   {pn} status — check current state"
    }
  },

  langs: {
    en: {
      enabled: "🔧 | Maintenance mode ENABLED.\n» Message: %1",
      disabled: "✅ | Maintenance mode DISABLED. Bot is back online.",
      alreadyOn: "⚠️ | Maintenance mode is already ON.",
      alreadyOff: "⚠️ | Maintenance mode is already OFF.",
      status: "📋 | Maintenance mode: %1\n» Message: %2",
      noArgs: "⚠️ | Use: {pn} on [message] | {pn} off | {pn} status",
      defaultMessage: "🔧 Bot is under maintenance. Please wait."
    }
  },

  onStart: async function ({ message, args, getLang }) {
    const sub = (args[0] || "").toLowerCase();
    const state = loadState();

    if (sub === "status") {
      return message.reply(getLang("status",
        state.enable ? "🔴 ON" : "🟢 OFF",
        state.message || getLang("defaultMessage")
      ));
    }

    if (sub === "on") {
      if (state.enable) return message.reply(getLang("alreadyOn"));
      const msg = args.slice(1).join(" ").trim() || getLang("defaultMessage");
      saveState({ enable: true, message: msg });
      return message.reply(getLang("enabled", msg));
    }

    if (sub === "off") {
      if (!state.enable) return message.reply(getLang("alreadyOff"));
      saveState({ enable: false, message: "" });
      return message.reply(getLang("disabled"));
    }

    return message.reply(getLang("noArgs"));
  }
};
