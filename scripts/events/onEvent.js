const allOnEvent = global.Anchestor.onEvent;

module.exports = {
	config: {
		name: "onEvent",
		version: "1.1",
		author: "xemonbae01",
		description: "Loop to all event in global.Anchestor.onEvent and run when have new event",
		category: "events"
	},

	onStart: async ({ api, args, message, event, threadsData, usersData, threadModel, userModel, role, commandName }) => {
		for (const item of allOnEvent) {
			if (typeof item === "string")
				continue;
			item.onStart({ api, args, message, event, threadsData, usersData, threadModel, userModel, role, commandName });
		}
	}
};
