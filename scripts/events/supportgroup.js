const { getTime } = global.utils;

if (!global.temp.supportGroup) global.temp.supportGroup = {};

function getTargets() {
  const { supportGroupID, adminBot = [] } = global.Anchestor.config;
  return [...new Set([
    ...(supportGroupID ? [String(supportGroupID)] : []),
    ...adminBot.map(String)
  ])];
}

async function notify(api, msg) {
  const targets = getTargets();
  for (const tid of targets) {
    try { await api.sendMessage(msg, tid); } catch {}
  }
}

module.exports = {
  config: {
    name: "supportgroup",
    version: "1.0",
    author: "Redwan Ahemed",
    description: "Forwards bot activity logs to the configured support group and admin accounts",
    category: "events"
  },

  onStart: async ({ api, event, usersData, threadsData }) => {
    const { logMessageType, logMessageData, threadID, author } = event;
    if (!logMessageType) return;

    if (
      logMessageType === "log:subscribe" &&
      logMessageData?.addedParticipants?.some(p => p.userFbId == api.getCurrentUserID())
    ) {
      return async function () {
        if (author == api.getCurrentUserID()) return;
        const threadInfo = await api.getThreadInfo(threadID).catch(() => null);
        const threadName = threadInfo?.threadName || `Group ${threadID}`;
        const addedBy = await usersData.getName(author).catch(() => author);
        const members = threadInfo?.participantIDs?.length ?? "?";
        const time = getTime("DD/MM/YYYY HH:mm:ss");

        await notify(api, [
          "➕ BOT ADDED TO GROUP",
          "",
          `📛 Group    : ${threadName}`,
          `🆔 Thread ID: ${threadID}`,
          `👤 Added by : ${addedBy} (${author})`,
          `👥 Members  : ${members}`,
          `📅 Time     : ${time}`
        ].join("\n"));
      };
    }

    if (
      logMessageType === "log:unsubscribe" &&
      logMessageData?.leftParticipantFbId == api.getCurrentUserID()
    ) {
      return async function () {
        if (author == api.getCurrentUserID()) return;
        const threadData = await threadsData.get(threadID).catch(() => null);
        const threadName = threadData?.threadName || `Group ${threadID}`;
        const kickedBy = await usersData.getName(author).catch(() => author);
        const time = getTime("DD/MM/YYYY HH:mm:ss");

        await notify(api, [
          "➖ BOT REMOVED FROM GROUP",
          "",
          `📛 Group    : ${threadName}`,
          `🆔 Thread ID: ${threadID}`,
          `👤 By       : ${kickedBy} (${author})`,
          `📅 Time     : ${time}`
        ].join("\n"));
      };
    }

    if (
      logMessageType === "log:subscribe" &&
      logMessageData?.addedParticipants &&
      !logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())
    ) {
      return async function () {
        const supportGroupID = global.Anchestor.config.supportGroupID;
        if (!supportGroupID || threadID == supportGroupID) return;

        const added = logMessageData.addedParticipants;
        const names = added.map(p => p.fullName || p.userFbId).join(", ");
        const threadData = await threadsData.get(threadID).catch(() => null);
        const threadName = threadData?.threadName || `Group ${threadID}`;
        const time = getTime("DD/MM/YYYY HH:mm:ss");

        await notify(api, [
          "👥 NEW MEMBER(S) IN GROUP",
          "",
          `📛 Group : ${threadName}`,
          `🆔 TID   : ${threadID}`,
          `👤 Joined: ${names}`,
          `📅 Time  : ${time}`
        ].join("\n"));
      };
    }
  }
};
