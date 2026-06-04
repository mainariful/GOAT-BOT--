
process.stdout.write("\x1b]2;Anchestor Bot - Developed By Redwan Ahemed\x1b\x5c");

const gradient = require("gradient-string");
const chalk = require("chalk");
const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");
const fca = require("tetroxide-fca");

(function _verifyIntegrity() {
  const _cr = require("crypto");
  const _s = [
    "\x41\x6e\x63\x68\x65\x73\x74\x6f\x72\x20\x42\x6f\x74\x20\x64\x65\x76\x65\x6c\x6f\x70\x65\x64\x20\x62\x79\x20\x52\x65\x64\x77\x61\x6e\x20\x41\x68\x65\x6d\x65\x64",
    "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x47\x69\x74\x48\x75\x62\x2e\x63\x6f\x6d\x2f\x78\x65\x6d\x6f\x6e\x62\x61\x65\x30\x31\x2f\x41\x6e\x63\x68\x65\x73\x74\x6f\x72\x2d\x52\x65\x73\x79\x6e\x63\x65\x64"
  ];
  const _k = "\x61\x6e\x63\x68\x65\x73\x74\x6f\x72\x2d\x69\x6e\x74\x65\x67\x72\x69\x74\x79\x2d\x32\x30\x32\x36";
  const _e = "626adfb01c85c376b2618e51358332ebde5a6b6cf14037f6fbf54f0a476f4101";
  const _h = _cr.createHmac("sha256", _k).update(_s.join("|")).digest("hex");
  if (_h !== _e) {
    process.stderr.write(
      "\x1b[31m\n" +
      "╔══════════════════════════════════════════════════════╗\n" +
      "║  ⛔  ANCHESTOR BOT — INTEGRITY VIOLATION DETECTED   ║\n" +
      "║  Developer credits have been tampered with.         ║\n" +
      "║  This bot is protected. Restore the original code.  ║\n" +
      "║  Source: GitHub.com/xemonbae01/Anchestor-Resynced   ║\n" +
      "╚══════════════════════════════════════════════════════╝\x1b[0m\n\n"
    );
    process.exit(1);
  }
})();

const { writeFileSync, readFileSync, existsSync, watch } = fs;
const handlerWhenListenHasError = require("./handlerWhenListenHasError.js");
const { callbackListenTime, storage5Message } = global.Anchestor;
const {
  log,
  logColor,
  createOraDots,
  jsonStringifyColor,
  getText,
  convertTime,
  colors,
  randomString,
} = global.utils;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const currentVersion = require(`${process.cwd()}/package.json`).version;

const _gbanPath = path.join(process.cwd(), "database", "global_bans.json");
try {
  global.Anchestor.globalBans = fs.existsSync(_gbanPath)
    ? JSON.parse(fs.readFileSync(_gbanPath, "utf8"))
    : {};
} catch {
  global.Anchestor.globalBans = {};
}

const _maintPath = path.join(process.cwd(), "database", "maintenance.json");
try {
  global.Anchestor.maintenance = fs.existsSync(_maintPath)
    ? JSON.parse(fs.readFileSync(_maintPath, "utf8"))
    : { enable: false, message: "" };
} catch {
  global.Anchestor.maintenance = { enable: false, message: "" };
}

let changeFbStateByCode = false;
let latestChangeContentAccount = 0;

function centerText(text, length) {
  const width = process.stdout.columns;
  const leftPadding = Math.floor((width - (length || text.length)) / 2);
  const rightPadding = width - leftPadding - (length || text.length);
  console.log(
    " ".repeat(leftPadding > 0 ? leftPadding : 0) +
    text +
    " ".repeat(rightPadding > 0 ? rightPadding : 0)
  );
}

const titles = [

  [
    "  ╔═╗ ╔╗╔ ╔═╗ ╦ ╦ ╔═╗ ╔═╗ ╔╦╗ ╔═╗ ╦═╗  ",
    "  ╠═╣ ║║║ ║   ╠═╣ ║╣  ╚═╗  ║  ║ ║ ╠╦╝  ",
    "  ╩ ╩ ╝╚╝ ╚═╝ ╩ ╩ ╚═╝ ╚═╝  ╩  ╚═╝ ╩╚═  ",
  ],

  [
    "▄▀█ █▄░█ █▀▀ █░█ █▀▀ █▀ ▀█▀ █▀█ █▀█",
    "█▀█ █░▀█ █▄▄ █▀█ ██▄ ▄█ ░█░ █▄█ █▀▄"
  ],

  ["ANCHESTOR v" + currentVersion],

  ["ANCHESTOR"]
];

const logoRowGradients = [
  gradient("#00f5d4", "#00bbf9", "#9b5de5"),
  gradient("#f15bb5", "#fee440", "#fb5607"),
  gradient("#9b5de5", "#00bbf9", "#00f5d4"),
];

const maxWidth = process.stdout.columns;
const title =
  maxWidth > 42 ? titles[0]
    : maxWidth > 36 ? titles[1]
      : maxWidth > 20 ? titles[2]
        : titles[3];

console.log(gradient("#f5af19", "#f12711")(createLine(null, true)));
console.log();
for (let i = 0; i < title.length; i++) {
  const text = title[i];
  const styled = title === titles[0]
    ? chalk.bold(logoRowGradients[i % logoRowGradients.length](text))
    : chalk.bold(gradient("#FA8BFF", "#2BD2FF", "#2BFF88")(text));
  centerText(styled, text.length);
}

const subTitle = "Anchestor Bot - A Facebook Messenger bot developed by Redwan Ahemed";
const subTitleArray = [];
let tempSub = subTitle;
if (subTitle.length > maxWidth) {
  while (tempSub.length > maxWidth) {
    let lastSpace = tempSub.slice(0, maxWidth).lastIndexOf(" ");
    lastSpace = lastSpace === -1 ? maxWidth : lastSpace;
    subTitleArray.push(tempSub.slice(0, lastSpace).trim());
    tempSub = tempSub.slice(lastSpace).trim();
  }
  if (tempSub) subTitleArray.push(tempSub);
} else {
  subTitleArray.push(subTitle);
}
const author = "Developed By Redwan Ahemed with ♡";
const srcUrl = "Source code: https://GitHub.com/xemonbae01/Anchestor-Resynced";
const fakeRelease = "ANCHESTOR BOT - OFFICIAL BUILD [tetroxide-fca]";
for (const t of subTitleArray) {
  centerText(gradient("#9F98E8", "#AFF6CF")(t), t.length);
}
centerText(gradient("#9F98E8", "#AFF6CF")(author), author.length);
centerText(gradient("#9F98E8", "#AFF6CF")(srcUrl), srcUrl.length);
centerText(gradient("#f5af19", "#f12711")(fakeRelease), fakeRelease.length);

let widthConsole = process.stdout.columns;
if (widthConsole > 50) widthConsole = 50;

function createLine(content, isMaxWidth = false) {
  if (!content)
    return Array(isMaxWidth ? process.stdout.columns : widthConsole).fill("─").join("");
  content = ` ${content.trim()} `;
  const lengthContent = content.length;
  const lengthLine = (isMaxWidth ? process.stdout.columns : widthConsole) - lengthContent;
  let left = Math.floor(lengthLine / 2);
  if (left < 0 || isNaN(left)) left = 0;
  const lineOne = Array(left).fill("─").join("");
  return lineOne + content + lineOne;
}

const character = createLine();

async function getName(userID) {
  try {
    const user = await axios.post(
      `https://www.facebook.com/api/graphql/?q=${`node(${userID}){name}`}`
    );
    return user.data[userID].name;
  } catch {
    return null;
  }
}

const { dirAccount } = global.client;

const intervalGetNewCookie = global.Anchestor.config.facebookAccount?.intervalGetNewCookie;
const AUTLOGIN_INTERVAL = typeof intervalGetNewCookie === 'number' && intervalGetNewCookie > 0
  ? intervalGetNewCookie * 60 * 1000
  : null;

function isExpiredAppState(filePath) {
  if (!AUTLOGIN_INTERVAL) return false;
  try {
    const stats = fs.statSync(filePath);
    return (Date.now() - stats.mtimeMs) > AUTLOGIN_INTERVAL;
  } catch {
    return true;
  }
}

const autologin = require('./autologin.js');

function appStateToCookie(appState) {
  if (!appState || !Array.isArray(appState)) return '';
  return appState
    .filter(e => e && e.key && e.value !== undefined)
    .map(e => `${e.key}=${e.value}`)
    .join('; ');
}

function cookieToAppState(cookieString) {
  if (!cookieString || typeof cookieString !== 'string') return [];
  return cookieString
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(pair => {
      const eqIndex = pair.indexOf('=');
      const key = eqIndex !== -1 ? pair.slice(0, eqIndex).trim() : pair.trim();
      const value = eqIndex !== -1 ? pair.slice(eqIndex + 1).trim() : '';
      return {
        key,
        value,
        domain: 'facebook.com',
        path: '/',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365
      };
    });
}

async function getAppStateToLogin() {
  let needAutologin = false;
  if (!existsSync(dirAccount) || isExpiredAppState(dirAccount)) {
    needAutologin = true;
  } else {
    try {
      const accountText = readFileSync(dirAccount, "utf8").trim();
      let appState;
      try {
        appState = JSON.parse(accountText);
      } catch {
        appState = cookieToAppState(accountText);
      }
      if (!Array.isArray(appState) || !appState.some(i => i.key && i.value)) {
        needAutologin = true;
      } else {
        return appState;
      }
    } catch (err) {
      log.error("LOGIN FACEBOOK", "appState invalid or not found", err.message);
      needAutologin = true;
    }
  }

  if (needAutologin) {
    log.info("LOGIN FACEBOOK", "Automatically fetching new appState/cookie using autologin...");
    const reloginResult = await autologin.handleRelogin();
    if (!reloginResult) {
      log.error("AUTOLOGIN", "Unable to fetch new appState/cookie.");
      process.exit(1);
    }
    const cookiePath = require('path').join(process.cwd(), 'account.txt');
    if (!existsSync(cookiePath)) {
      log.error("AUTOLOGIN", "Unable to find account.txt file after autologin.");
      process.exit(1);
    }
    const cookieString = readFileSync(cookiePath, "utf8");
    const appState = cookieToAppState(cookieString);
    writeFileSync(dirAccount, JSON.stringify(appState, null, 2));
    log.info("LOGIN FACEBOOK", "Successfully fetched new appState/cookie!");
    return appState;
  }
}

function stopListening(keyListen) {
  keyListen = keyListen || Object.keys(callbackListenTime).pop();
  return new Promise((resolve) => {
    const api = global.Anchestor.fcaApi;
    if (global.Anchestor.Listening && api?.ws) {
      try { api.ws.off(global.Anchestor.Listening); } catch (_) {}
    }
    global.Anchestor.Listening = null;
    if (callbackListenTime[keyListen]) callbackListenTime[keyListen] = () => {};
    resolve();
  });
}

async function startBot() {
  console.log(colors.hex("#f5ab00")(createLine("START LOGGING IN", true)));

  if (global.Anchestor.Listening) await stopListening();

  log.info("LOGIN FACEBOOK", getText("login", "currentlyLogged"));

  let appState = await getAppStateToLogin();
  changeFbStateByCode = true;
  writeFileSync(dirAccount, JSON.stringify(appState, null, 2));
  setTimeout(() => (changeFbStateByCode = false), 1000);

  (async function loginBot(appState) {
    global.Anchestor.commands = new Map();
    global.Anchestor.eventCommands = new Map();
    global.Anchestor.aliases = new Map();
    global.Anchestor.onChat = [];
    global.Anchestor.onEvent = [];
    global.Anchestor.onReply = new Map();
    global.Anchestor.onReaction = new Map();
    clearInterval(global.intervalRestartListenMqtt);
    delete global.intervalRestartListenMqtt;

    let isSendNotiErrorMessage = false;

    const fbAccount = global.Anchestor.config.facebookAccount || {};

    const fcaConfig = (() => {
      try { return JSON.parse(readFileSync(`${process.cwd()}/configFca.json`, 'utf8')); }
      catch { return {}; }
    })();

    let api;
    try {
      api = await fca.connect({
        cookie: appStateToCookie(appState),
        facebookAccount: {
          email:     fbAccount.email     || '',
          password:  fbAccount.password  || '',
          twofactor: fbAccount['2FASecret'] || '',
        },
        mode: fcaConfig.mode || 'auto',
        api: {
          url: fcaConfig.api?.url || 'https://api.khotools.com',
          key: fcaConfig.api?.key || '',
          fca: fcaConfig.api?.fca || 'fcaPrime',
        },
      });
    } catch (error) {
      log.err("LOGIN FACEBOOK", getText("login", "loginError"), error);
      global.statusAccountBot = "can't login";
      process.exit();
      return;
    }

    const health = api.health();
    if (api.mode === 'raw') {
      const bold = '\x1b[1m', rst = '\x1b[0m';
      const bGreen = '\x1b[92m', bWhite = '\x1b[97m', bYellow = '\x1b[93m';
      const bMagenta = '\x1b[95m', bBlue = '\x1b[94m', bRed = '\x1b[91m';
      const rows = [
        bold + bGreen   + '  ✅  Anchestor Raw FCA Connected'                     + rst,
        '',
        bold + bWhite   + '  📍  Mode            ' + rst + bYellow + 'RAW'        + rst,
        bold + bWhite   + '  🔄  Auto-reconnect  ' + rst + bRed    + 'N/A (Raw FCA)' + rst,
        bBlue           + '  🌐  github.com/xemonbae01/Anchestor-Resynced'         + rst,
        '',
        bold + bMagenta + '  💎  Author  Redwan Ahemed (xemonbae01)'               + rst,
      ];
      process.stdout.write('\n');
      rows.forEach(line => console.log(line));
      process.stdout.write('\n');
    } else {
      log.info("TETROXIDE", `Connected via mode: ${colors.cyan(api.mode.toUpperCase())} | WS: ${health.ws?.connected ? colors.green('connected') : colors.red('disconnected')}`);
    }

    api.ws.on("tetroxide.mode_switch", (e) => {
      log.info("TETROXIDE", `Mode switched: ${colors.yellow(e.from)} → ${colors.green(e.to)} (reason: ${e.reason})`);
    });
    api.ws.on("tetroxide.ws_fail", (e) => {
      log.warn("TETROXIDE", `WebSocket permanently failed — running on Raw FCA fallback. ${e?.reason || ''}`);
    });
    api.ws.on("tetroxide.ws_recovery", (e) => {
      log.info("TETROXIDE", `WebSocket recovered and switched back to WS mode. ${e?.reason || ''}`);
    });
    api.ws.on("tetroxide.session_error", (e) => {
      log.err("TETROXIDE", `Session error: ${e?.message || e}`);
    });

    {
      global.Anchestor.fcaApi = api;
      global.Anchestor.botID = api.getCurrentUserID();
      log.info("LOGIN FACEBOOK", getText("login", "loginSuccess"));
      global.botID = api.getCurrentUserID();
      logColor("#f5ab00", createLine("BOT INFO"));
      log.info("NODE VERSION", process.version);
      log.info("PROJECT VERSION", currentVersion);
      log.info("BOT ID", `${global.botID} - ${await getName(global.botID)}`);
      log.info("PREFIX", global.Anchestor.config.prefix);
      log.info("LANGUAGE", global.Anchestor.config.language);
      log.info("BOT NICK NAME", global.Anchestor.config.nickNameBot || "ANCHESTOR BOT");
      log.info("FCA ENGINE", `tetroxide-fca | mode: ${api.mode.toUpperCase()}`);

      let notification = '';
      try {
        const getNoti = await axios.get(
          "https://raw.githubusercontent.com/xemonbae01/Anchestor-Resynced/main/notification.txt"
        );
        notification = getNoti.data;
      } catch {
        log.warn("NOTIFICATION", "Could not fetch notifications data — continuing anyway");
      }

      if (global.Anchestor.config.autoRefreshFbstate === true) {
        if (typeof api.getAppState === 'function') {
          changeFbStateByCode = true;
          try {
            writeFileSync(dirAccount, JSON.stringify(api.getAppState(), null, 2));
            log.info("REFRESH FBSTATE", getText("login", "refreshFbstateSuccess", path.basename(dirAccount)));
          } catch (err) {
            log.warn("REFRESH FBSTATE", getText("login", "refreshFbstateError", path.basename(dirAccount)), err);
          }
          setTimeout(() => (changeFbStateByCode = false), 1000);
        } else {
          log.info("REFRESH FBSTATE", "Skipped — tetroxide-fca manages session via WebSocket");
        }
      }

      const {
        threadModel,
        userModel,
        globalModel,
        threadsData,
        usersData,
        globalData,
        sequelize,
      } = await require("./loadData.js")(api, createLine);

      await require("./loadScripts.js")(
          api,
          threadModel,
          userModel,
          globalModel,
          threadsData,
          usersData,
          globalData,
          createLine
        );

      if (global.Anchestor.config.autoLoadScripts?.enable === true) {
        const ignoreCmds =
          global.Anchestor.config.autoLoadScripts.ignoreCmds
            ?.replace(/[ ,]+/g, " ")
            .trim()
            .split(" ") || [];
        const ignoreEvents =
          global.Anchestor.config.autoLoadScripts.ignoreEvents
            ?.replace(/[ ,]+/g, " ")
            .trim()
            .split(" ") || [];

        watch(`${process.cwd()}/scripts/cmds`, async (event, filename) => {
          if (filename.endsWith(".js")) {
            if (ignoreCmds.includes(filename) || filename.endsWith(".eg.js")) return;
            if (
              (event === "change" || event === "rename") &&
              existsSync(`${process.cwd()}/scripts/cmds/${filename}`)
            ) {
              try {
                const contentCommand = global.temp.contentScripts.cmds[filename] || "";
                const currentContent = readFileSync(
                  `${process.cwd()}/scripts/cmds/${filename}`,
                  "utf-8"
                );
                if (contentCommand === currentContent) return;
                global.temp.contentScripts.cmds[filename] = currentContent;
                filename = filename.replace(".js", "");

                const infoLoad = global.utils.loadScripts(
                  "cmds",
                  filename,
                  log,
                  global.Anchestor.configCommands,
                  api,
                  threadModel,
                  userModel,
                  globalModel,
                  threadsData,
                  usersData,
                  globalData
                );
                if (infoLoad.status === "success")
                  log.master("AUTO LOAD SCRIPTS", `Command ${filename}.js (${infoLoad.command.config.name}) has been reloaded`);
                else
                  log.err("AUTO LOAD SCRIPTS", `Error when reload command ${filename}.js`, infoLoad.error);
              } catch (err) {
                log.err("AUTO LOAD SCRIPTS", `Error when reload command ${filename}.js`, err);
              }
            }
          }
        });

        watch(`${process.cwd()}/scripts/events`, async (event, filename) => {
          if (filename.endsWith(".js")) {
            if (ignoreEvents.includes(filename) || filename.endsWith(".eg.js")) return;
            if (
              (event === "change" || event === "rename") &&
              existsSync(`${process.cwd()}/scripts/events/${filename}`)
            ) {
              try {
                const contentEvent = global.temp.contentScripts.events[filename] || "";
                const currentContent = readFileSync(
                  `${process.cwd()}/scripts/events/${filename}`,
                  "utf-8"
                );
                if (contentEvent === currentContent) return;
                global.temp.contentScripts.events[filename] = currentContent;
                filename = filename.replace(".js", "");

                const infoLoad = global.utils.loadScripts(
                  "events",
                  filename,
                  log,
                  global.Anchestor.configCommands,
                  api,
                  threadModel,
                  userModel,
                  globalModel,
                  threadsData,
                  usersData,
                  globalData
                );
                if (infoLoad.status === "success")
                  log.master("AUTO LOAD SCRIPTS", `Event ${filename}.js (${infoLoad.command.config.name}) has been reloaded`);
                else
                  log.err("AUTO LOAD SCRIPTS", `Error when reload event ${filename}.js`, infoLoad.error);
              } catch (err) {
                log.err("AUTO LOAD SCRIPTS", `Error when reload event ${filename}.js`, err);
              }
            }
          }
        });
      }

      logColor("#f5ab00", character);
      let i = 0;
      const adminBot = global.Anchestor.config.adminBot
        .filter((item) => !isNaN(item))
        .map((item) => item.toString());
      for (const uid of adminBot) {
        try {
          const userName = await usersData.getName(uid);
          log.master("ADMINBOT", `[${++i}] ${uid} | ${userName}`);
        } catch {
          log.master("ADMINBOT", `[${++i}] ${uid}`);
        }
      }
      log.master("NOTIFICATION", (notification || "").trim());
      log.master("SUCCESS", getText("login", "runBot"));
      log.master("LOAD TIME", `${convertTime(Date.now() - global.Anchestor.startTime)}`);

      (() => {
        try {
          const { supportGroupID, adminBot: admins } = global.Anchestor.config;
          const cmdCount = global.Anchestor.commands?.size || 0;
          const evtCount = global.Anchestor.onEvent?.length || 0;
          const loadMs = Date.now() - global.Anchestor.startTime;
          const startMsg = [
            "🟢 ANCHESTOR BOT ONLINE",
            "",
            `🤖 Bot ID  : ${global.botID}`,
            `⚡ Mode    : ${api.mode?.toUpperCase() || "UNKNOWN"}`,
            `📦 Commands: ${cmdCount}`,
            `🔔 Events  : ${evtCount}`,
            `⏱ Load time: ${convertTime(loadMs)}`,
            `📅 Time    : ${global.utils?.getTime?.("DD/MM/YYYY HH:mm:ss") || new Date().toLocaleString()}`
          ].join("\n");
          const targets = [...new Set([
            ...(supportGroupID ? [String(supportGroupID)] : []),
            ...(admins || []).map(String)
          ])];
          for (const tid of targets) {
            api.sendMessage(startMsg, tid).catch(() => {});
          }
        } catch {}
      })();

      logColor("#f5ab00", createLine("COPYRIGHT"));
      console.log(
        `\x1b[1m\x1b[33mCOPYRIGHT:\x1b[0m\x1b[1m\x1b[37m \x1b[0m\x1b[1m\x1b[36mAnchestor Bot developed by Redwan Ahemed (https://GitHub.com/xemonbae01/Anchestor-Resynced). Thank you for using!\x1b[0m`
      );
      logColor("#f5ab00", character);
      global.Anchestor.config.adminBot = adminBot;
      writeFileSync(global.client.dirConfig, JSON.stringify(global.Anchestor.config, null, 2));
      writeFileSync(global.client.dirConfigCommands, JSON.stringify(global.Anchestor.configCommands, null, 2));

      const { restartListenMqtt } = global.Anchestor.config;
      let intervalCheckLiveCookieAndRelogin = false;

      async function callBackListen(error, event) {
        if (error) {
          global.statusAccountBot = "can't login";
          if (!isSendNotiErrorMessage) {
            await handlerWhenListenHasError({
              api,
              threadModel,
              userModel,
              globalModel,
              threadsData,
              usersData,
              globalData,
              error,
            });
            isSendNotiErrorMessage = true;
          }
          if (global.Anchestor.config.autoRestartWhenListenMqttError)
            process.exit(2);
          else {
            const keyListen = Object.keys(callbackListenTime).pop();
            if (callbackListenTime[keyListen]) callbackListenTime[keyListen] = () => {};
            let times = 5;
            const spin = createOraDots(getText("login", "retryCheckLiveCookie", times));
            const countTimes = setInterval(() => {
              times--;
              if (times === 0) times = 5;
              spin.text = getText("login", "retryCheckLiveCookie", times);
            }, 1000);

            if (!intervalCheckLiveCookieAndRelogin) {
              intervalCheckLiveCookieAndRelogin = true;
              const interval = setInterval(async () => {
                clearInterval(interval);
                clearInterval(countTimes);
                intervalCheckLiveCookieAndRelogin = false;
                const keyListen = Date.now();
                isSendNotiErrorMessage = false;

                if (global.Anchestor.Listening && api?.ws) {
                  try { api.ws.off(global.Anchestor.Listening); } catch (_) {}
                }
                global.Anchestor.Listening = api.listen(createCallBackListen(keyListen));
              }, 5000);
            }
          }
          return;
        }

        if (event?.type?.startsWith?.('tetroxide.')) return;

        global.statusAccountBot = "good";
        const configLog = global.Anchestor.config.logEvents;
        if (isSendNotiErrorMessage) isSendNotiErrorMessage = false;

        if (
          global.Anchestor.config.whiteListMode?.enable &&
          global.Anchestor.config.whiteListModeThread?.enable &&
          !global.Anchestor.config.adminBot.includes(event.senderID)
        ) {
          if (
            !global.Anchestor.config.whiteListMode.whiteListIds.includes(event.senderID) &&
            !global.Anchestor.config.whiteListModeThread.whiteListThreadIds.includes(event.threadID) &&
            !global.Anchestor.config.adminBot.includes(event.senderID)
          ) return;
        } else if (
          global.Anchestor.config.whiteListMode?.enable &&
          !global.Anchestor.config.whiteListMode.whiteListIds.includes(event.senderID) &&
          !global.Anchestor.config.adminBot.includes(event.senderID)
        ) return;
        else if (
          global.Anchestor.config.whiteListModeThread?.enable &&
          !global.Anchestor.config.whiteListModeThread.whiteListThreadIds.includes(event.threadID) &&
          !global.Anchestor.config.adminBot.includes(event.senderID)
        ) return;

        if (event.messageID && event.type === "message") {
          if (storage5Message.includes(event.messageID))
            Object.keys(callbackListenTime)
              .slice(0, -1)
              .forEach((key) => { callbackListenTime[key] = () => {}; });
          else storage5Message.push(event.messageID);
          if (storage5Message.length > 5) storage5Message.shift();
        }

        if (!configLog.disableAll && configLog[event.type] !== false) {
          const participantIDs_ = [...(event.participantIDs || [])];
          if (event.participantIDs)
            event.participantIDs = "Array(" + event.participantIDs.length + ")";
          console.log(
            colors.green((event.type || "").toUpperCase() + ":"),
            jsonStringifyColor(event, null, 2)
          );
          if (event.participantIDs) event.participantIDs = participantIDs_;
        }

        const handlerAction = require("../handler/handlerAction.js")(
          api,
          threadModel,
          userModel,
          globalModel,
          usersData,
          threadsData,
          globalData
        );
        handlerAction(event);
      }

      function createCallBackListen(key) {
        key = randomString(10) + (key || Date.now());
        callbackListenTime[key] = callBackListen;
        return function (error, event) {
          callbackListenTime[key](error, event);
        };
      }

      await stopListening();

      global.Anchestor.Listening = api.listen(createCallBackListen());
      global.Anchestor.callBackListen = callBackListen;

      const healthCheckInterval = setInterval(() => {
        try {
          const h = api.health();
          log.info("HEALTH", `mode=${colors.cyan(h.mode)} | uptime=${convertTime(h.uptime)} | ws.connected=${h.ws?.connected ? colors.green('yes') : colors.red('no')} | switches=${h.switches}`);
        } catch (_) {}
      }, 30 * 60 * 1000);
      global.tetroxideHealthInterval = healthCheckInterval;

      if (restartListenMqtt.enable) {
        if (restartListenMqtt.logNoti) {
          log.info("LISTEN_MQTT", getText("login", "restartListenMessage", convertTime(restartListenMqtt.timeRestart, true)));
          log.info("BOT_STARTED", getText("login", "startBotSuccess"));
          logColor("#f5ab00", character);
        }
        const restart = setInterval(async function () {
          if (!restartListenMqtt.enable) {
            clearInterval(restart);
            return log.warn("LISTEN_MQTT", getText("login", "stopRestartListenMessage"));
          }
          try {
            await stopListening();
            await sleep(restartListenMqtt.delayAfterStopListening || 2000);
            global.Anchestor.Listening = api.listen(createCallBackListen());
            log.info("LISTEN_MQTT", getText("login", "restartListenMessage2"));
          } catch (e) {
            log.err("LISTEN_MQTT", getText("login", "restartListenMessageError"), e);
          }
        }, restartListenMqtt.timeRestart);
        global.intervalRestartListenMqtt = restart;
      }
    }
  })(appState);

  if (global.Anchestor.config.autoReloginWhenChangeAccount) {
    setTimeout(function () {
      watch(dirAccount, async (type) => {
        if (
          type === "change" &&
          changeFbStateByCode === false &&
          latestChangeContentAccount !== fs.statSync(dirAccount).mtimeMs
        ) {
          clearInterval(global.intervalRestartListenMqtt);
          clearInterval(global.tetroxideHealthInterval);
          global.compulsoryStopLisening = true;
          latestChangeContentAccount = fs.statSync(dirAccount).mtimeMs;
          startBot();
        }
      });
    }, 10000);
  }
}

global.Anchestor.reLoginBot = startBot;
startBot();
