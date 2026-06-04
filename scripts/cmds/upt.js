const os = require('os');
const { bold } = require("fontstyles");

module.exports = {
  config: {
    name: 'uptime',
    aliases: ['stats', 'status', 'system', 'rtm'],
    version: '1.7',
    author: 'Mahi | Redwan',
    countDown: 15,
    role: 0,
    shortDescription: 'Display bot uptime + system health + command stats',
    longDescription: {
      id: 'Display bot uptime + system health + command stats',
      en: 'Display bot uptime + system health + command stats'
    },
    category: 'system',
    guide: {
      id: '{pn}: Display bot uptime and system health details',
      en: '{pn}: Display bot uptime and system health details'
    }
  },

  onStart: async function ({ message, event, usersData, threadsData, api }) {
    if (this.config.author !== 'Mahi | Redwan') {
      return message.reply("⚠ Unauthorized author change detected. Command execution stopped.");
    }

    const startTime = Date.now();
    const users = await usersData.getAll();
    const groups = await threadsData.getAll();
    const uptime = process.uptime();

    const bangladeshTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });

    try {
      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      const memoryUsage = process.memoryUsage();
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercentage = (usedMemory / totalMemory * 100).toFixed(2);

      const usedMemoryGB = (usedMemory / 1024 / 1024 / 1024).toFixed(2);
      const totalMemoryGB = (totalMemory / 1024 / 1024 / 1024).toFixed(2);
      const freeMemoryGB = (freeMemory / 1024 / 1024 / 1024).toFixed(2);

      const cpuUsage = os.loadavg();
      const cpuCores = os.cpus().length;
      const cpuModel = os.cpus()[0].model;
      const nodeVersion = process.version;
      const platform = os.platform();

      const cpuLoadEmoji =
        cpuUsage[0] < 1 ? "🟢" :
        cpuUsage[0] < 2 ? "🟡" : "🔴";

      const securityMode = "🛡 Secure Mode Active";

      const healthScore = Math.max(
        0,
        100 - (cpuUsage[0] * 10) - (memoryUsagePercentage * 0.5)
      ).toFixed(0);

      const commandUsage = await threadsData.get(event.threadID, "commandUsage") || {};
      const sortedCommands = Object.entries(commandUsage).sort((a, b) => b[1] - a[1]);

      const topCommand = sortedCommands[0] ? sortedCommands[0][0] : "No data";
      const topCommandCount = sortedCommands[0] ? sortedCommands[0][1] : 0;

      const endTime = Date.now();
      const botPing = endTime - startTime;
      const totalMessages = users.reduce((sum, user) => sum + (user.messageCount || 0), 0);

      const mediaBan = await threadsData.get(event.threadID, 'mediaBan') || false;
      const mediaBanStatus = mediaBan
        ? '🚫 Media is currently banned in this chat.'
        : '✅ Media is not banned in this chat.';

      const uptimeResponse = uptime > 86400
        ? "I've been running for quite a while now! 💪"
        : "Just getting started! 😎";

      const editSegments = [
        `🖥 ${bold("System Statistics")}:
• Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
• Memory Usage: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,

        `• Total Memory: ${totalMemoryGB} GB
• Free Memory: ${freeMemoryGB} GB
• Used Memory: ${usedMemoryGB} GB
• Memory Usage: ${memoryUsagePercentage}%`,

        `• CPU Load: ${cpuLoadEmoji} ${cpuUsage[0].toFixed(2)}%
• CPU (5m): ${cpuUsage[1].toFixed(2)}%
• CPU (15m): ${cpuUsage[2].toFixed(2)}%
• CPU Cores: ${cpuCores}
• CPU Model: ${cpuModel}`,

        `• Node.js Version: ${nodeVersion}
• Platform: ${platform}
• Ping: ${botPing}ms
• Total Users: ${users.length}
• Total Groups: ${groups.length}`,

        `📊 ${bold("Command Usage")}:
• Most Used Command: ${topCommand}
• Used: ${topCommandCount} times

🛡 ${bold("Security")}:
• ${securityMode}

❤️ ${bold("System Health Score")}:
• ${healthScore}/100

• Messages Processed: ${totalMessages}
${mediaBanStatus}

📅 ${bold("Current Time (BD)")}:
• ${bangladeshTime}

${uptimeResponse}`
      ];

      const loadingFrames = [
        'LOADING.\n[█▒▒▒▒▒▒▒▒▒]',
        'LOADING..\n[██▒▒▒▒▒▒▒▒]',
        'LOADING...\n[████▒▒▒▒▒▒]',
        'LOADING...\n[███████▒▒]',
        'LOADED...\n[█████████]'
      ];

      let sentMessage = await message.reply("🖥 Initializing system stats...");

      const editMessageContent = (index) => {
        if (index < editSegments.length) {
          const loadingProgress = loadingFrames[index];
          const currentContent = `${loadingProgress}\n\n${editSegments.slice(0, index + 1).join('\n\n')}`;
          api.editMessage(currentContent, sentMessage.messageID);
          setTimeout(() => editMessageContent(index + 1), 800);
        }
      };

      editMessageContent(0);

    } catch (err) {
      console.error(err);
      return message.reply("❌ An error occurred while fetching system statistics.");
    }
  }
};
