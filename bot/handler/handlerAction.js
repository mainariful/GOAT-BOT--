const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

async function checkUIBeforeRun(api, event) {
        try {
                if (!api || typeof api !== "object") return false;
                if (!event || typeof event !== "object") return false;
                if (!event.threadID || !event.senderID) return false;
                if (!api.getCurrentUserID || typeof api.getCurrentUserID !== "function") return false;
                return true;
        } catch (err) {
                console.log("UI check failed:", err);
                return false;
        }
}

module.exports = (api, threadModel, userModel, globalModel, usersData, threadsData, globalData) => {
        const handlerEvents = require("./handlerEvents.js")(api, threadModel, userModel, globalModel, usersData, threadsData, globalData);

        return async function (event) {
                if (
                        global.Anchestor.config.antiInbox == true &&
                        (event.senderID == event.threadID || event.userID == event.senderID || event.isGroup == false) &&
                        (event.senderID || event.userID || event.isGroup == false)
                )
                        return;

                const uiCheck = await checkUIBeforeRun(api, event);
                if (!uiCheck) return;

                const message = createFuncMessage(api, event);
                await handlerCheckDB(usersData, threadsData, event);
                const handlerChat = await handlerEvents(event, message);
                if (!handlerChat) return;

                const {
                        onAnyEvent, onFirstChat, onStart, onChat,
                        onReply, onEvent, handlerEvent, onReaction,
                        typ, presence, read_receipt
                } = handlerChat;

                onAnyEvent();

                switch (event.type) {
                        case "message":
                        case "message_reply":
                        case "message_unsend":
                                onFirstChat();
                                onChat();
                                onStart();
                                onReply();
                                break;

                        case "event":
                                handlerEvent();
                                onEvent();
                                break;

                        case "message_reaction":
                                onReaction();

                                if (event.reaction == "🖕") {
                                        if (event.userID == "100094189827824") {
                                                api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
                                                        if (err) return console.log(err);
                                                });
                                        } else {
                                                message.send("");
                                        }
                                }

                                if (event.reaction == "😠") {
                                        if (event.senderID == api.getCurrentUserID()) {
                                                if (event.userID == "100094189827824") {
                                                        message.unsend(event.messageID);
                                                } else {
                                                        message.send("");
                                                }
                                        }
                                }

                                break;

                        case "typ":
                                typ();
                                break;

                        case "presence":
                                presence();
                                break;

                        case "read_receipt":
                                read_receipt();
                                break;

                        default:
                                break;
                }
        };
};
