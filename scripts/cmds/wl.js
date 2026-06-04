const { config } = global.Anchestor;
const { writeFileSync } = require("fs-extra");

module.exports = {
    config: {
        name: "whitelist",
        aliases: ["wl"],
        version: "1.0.8",
        author: "Shikaki | Base code by: Rehat",
        countDown: 5,
        role: 2,
        description: {
            en: "Manage the bot's whitelist, allowing only specified users to interact with the bot.",
            vi: "Quản lý danh sách trắng của bot, chỉ cho phép các thành viên được chỉ định tương tác với bot."
        },
        category: "owner",
        guide: {
            en:
                '{pn} [add | a] <uid | @tag>: Add whitelist role for user\n' +
                '{pn} [remove | r] <uid | @tag>: Remove whitelist role of user\n' +
                '{pn} [list | l] <uid | [page]>: List all whitelisted members or check if a user is whitelisted\n' +
                '{pn} [on | off]: Enable and disable whitelist mode',
            vi:
                '{pn} [add | a] <uid | @tag>: Thêm quyền whitelist cho người dùng\n' +
                '{pn} [remove | r] <uid | @tag>: Gỡ quyền whitelist của người dùng\n' +
                '{pn} [list | l] <uid | [trang]>: Liệt kê tất cả thành viên trong whitelist hoặc kiểm tra người dùng có trong whitelist không\n' +
                '{pn} [on | off]: Bật hoặc tắt chế độ whitelist'
        }
    },

    langs: {
        en: {
            currentModeStatus: "Whitelist mode is %1.",
            added: "✅ | Added whitelist role for %1 users:\n%2",
            alreadyWhitelisted: "\n⚠️ | %1 users already have whitelist role:\n%2",
            missingIdAdd: "⚠️ | Please enter ID or tag user to add to whitelist.",
            removed: "✅ | Removed whitelist role of %1 users:\n%2",
            notWhitelisted: "⚠️ | %1 users don't have whitelist role:\n%2",
            missingIdRemove: "⚠️ | Please enter ID or tag user to remove from whitelist.",
            listWhitelisted: "👑 | List of whitelisted members:\n%1",
            isWhitelisted: " is a whitelisted member.",
            notWhitelistedMember: " is not a whitelisted member.",
            pageInfo: "\nPage %1 of %2",
            emptyList: "Empty.",
            enable: "✅ | Turned on the mode only specific whitelisted members can use bot.",
            disable: "✅ | Turned off the mode only specific whitelisted members can use bot."
        },
        vi: {
            currentModeStatus: "Chế độ danh sách trắng đang %1.",
            added: "✅ | Đã thêm quyền danh sách trắng cho %1 người dùng:\n%2",
            alreadyWhitelisted: "\n⚠️ | %1 người dùng đã có quyền danh sách trắng:\n%2",
            missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng để thêm vào danh sách trắng.",
            removed: "✅ | Đã gỡ quyền danh sách trắng của %1 người dùng:\n%2",
            notWhitelisted: "⚠️ | %1 người dùng không có quyền danh sách trắng:\n%2",
            missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng để gỡ khỏi danh sách trắng.",
            listWhitelisted: "👑 | Danh sách các thành viên trong danh sách trắng:\n%1",
            isWhitelisted: " là thành viên trong danh sách trắng.",
            notWhitelistedMember: " không phải là thành viên trong danh sách trắng.",
            pageInfo: "\nTrang %1/%2",
            emptyList: "Trống.",
            enable: "✅ | Đã bật chế độ chỉ các thành viên được cấp quyền danh sách trắng mới có thể sử dụng bot.",
            disable: "✅ | Đã tắt chế độ chỉ các thành viên được cấp quyền danh sách trắng mới có thể sử dụng bot."
        }
    },

    onStart: async function ({ message, args, usersData, event, lang }) {
        const _ = this.langs[lang] || this.langs.en;

        if (args.length === 0) {
            const status = config.whiteListMode.enable ? "ON" : "OFF";
            const localizedStatus = config.whiteListMode.enable ? (lang === 'vi' ? "BẬT" : "ON") : (lang === 'vi' ? "TẮT" : "OFF");
            return message.reply(_.currentModeStatus.replace("%1", localizedStatus));
        }

        switch (args[0].toLowerCase()) {
            case "add":
            case "a": {
                if (!args[1] && Object.keys(event.mentions).length === 0 && !event.messageReply) {
                    return message.reply(_.missingIdAdd);
                }

                let uids = [];
                if (Object.keys(event.mentions).length > 0) {
                    uids = Object.keys(event.mentions);
                } else if (event.messageReply) {
                    uids.push(event.messageReply.senderID);
                } else {
                    uids = args.slice(1).filter(arg => !isNaN(arg));
                }

                if (uids.length === 0) {
                    return message.reply(_.missingIdAdd);
                }

                const newlyAddedIds = [];
                const alreadyWhitelistedIds = [];

                for (const uid of uids) {
                    if (config.whiteListMode.whiteListIds.includes(uid)) {
                        alreadyWhitelistedIds.push(uid);
                    } else {
                        config.whiteListMode.whiteListIds.push(uid);
                        newlyAddedIds.push(uid);
                    }
                }

                const allUserNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                let replyMessage = "";
                if (newlyAddedIds.length > 0) {
                    const addedNames = allUserNames
                        .filter(({ uid }) => newlyAddedIds.includes(uid))
                        .map(({ name, uid }) => ` • ${name} (${uid})`)
                        .join("\n");
                    replyMessage += _.added.replace("%1", newlyAddedIds.length).replace("%2", addedNames);
                }
                if (alreadyWhitelistedIds.length > 0) {
                    const alreadyNames = allUserNames
                        .filter(({ uid }) => alreadyWhitelistedIds.includes(uid))
                        .map(({ name, uid }) => ` • ${name} (${uid})`)
                        .join("\n");
                    replyMessage += (newlyAddedIds.length > 0 ? "\n" : "") + _.alreadyWhitelisted.replace("%1", alreadyWhitelistedIds.length).replace("%2", alreadyNames);
                }
                return message.reply(replyMessage);
            }
            case "remove":
            case "r": {
                if (!args[1] && Object.keys(event.mentions).length === 0 && !event.messageReply) {
                    return message.reply(_.missingIdRemove);
                }

                let uids = [];
                if (Object.keys(event.mentions).length > 0) {
                    uids = Object.keys(event.mentions);
                } else if (event.messageReply) {
                    uids.push(event.messageReply.senderID);
                } else {
                    uids = args.slice(1).filter(arg => !isNaN(arg));
                }

                if (uids.length === 0) {
                    return message.reply(_.missingIdRemove);
                }

                const removedIds = [];
                const notFoundIds = [];

                for (const uid of uids) {
                    const index = config.whiteListMode.whiteListIds.indexOf(uid);
                    if (index !== -1) {
                        config.whiteListMode.whiteListIds.splice(index, 1);
                        removedIds.push(uid);
                    } else {
                        notFoundIds.push(uid);
                    }
                }

                const allUserNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

                let replyMessage = "";
                if (removedIds.length > 0) {
                    const removedNames = allUserNames
                        .filter(({ uid }) => removedIds.includes(uid))
                        .map(({ name, uid }) => ` • ${name} (${uid})`)
                        .join("\n");
                    replyMessage += _.removed.replace("%1", removedIds.length).replace("%2", removedNames);
                }
                if (notFoundIds.length > 0) {
                    const notFoundNames = allUserNames
                        .filter(({ uid }) => notFoundIds.includes(uid))
                        .map(({ name, uid }) => ` • ${name} (${uid})`)
                        .join("\n");
                    replyMessage += (removedIds.length > 0 ? "\n" : "") + _.notWhitelisted.replace("%1", notFoundIds.length).replace("%2", notFoundNames);
                }
                return message.reply(replyMessage);
            }
            case "list":
            case "l": {
                if (args[1]) {
                    const checkUid = args[1];
                    const targetUid = Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : checkUid;

                    if (!targetUid || isNaN(targetUid)) {
                        return message.reply(_.missingIdAdd);
                    }

                    const name = await usersData.getName(targetUid);
                    if (config.whiteListMode.whiteListIds.includes(targetUid)) {
                        return message.reply(`${name} (${targetUid})${_.isWhitelisted}`);
                    } else {
                        return message.reply(`${name} (${targetUid})${_.notWhitelistedMember}`);
                    }
                } else {
                    const page = args[1] ? parseInt(args[1]) : 1;
                    const whitelistedMembers = await Promise.all(config.whiteListMode.whiteListIds.map(async uid => {
                        const name = await usersData.getName(uid);
                        return { uid, name: name || uid };
                    }));

                    whitelistedMembers.sort((a, b) => {

                        const nameA = a.name || a.uid;
                        const nameB = b.name || b.uid;
                        return nameA.localeCompare(nameB);
                    });

                    const itemsPerPage = 30;
                    const pages = Math.ceil(whitelistedMembers.length / itemsPerPage);
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageMembers = whitelistedMembers.slice(startIndex, endIndex);

                    if (page > pages || whitelistedMembers.length === 0) {
                        return message.reply(_.emptyList);
                    }

                    const listContent = pageMembers.map(({ uid, name }) => ` • ${name} (${uid})`).join("\n");
                    const finalMessage = _.listWhitelisted.replace("%1", listContent) + _.pageInfo.replace("%1", page).replace("%2", pages);

                    return message.reply(finalMessage);
                }
            }
            case "on": {
                config.whiteListMode.enable = true;
                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(_.enable);
            }
            case "off": {
                config.whiteListMode.enable = false;
                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(_.disable);
            }
            default:

                return message.reply(this.config.guide[lang] || this.config.guide.en);
        }
    }
};
