## Anchestor Bot – Messenger Automation

A Node.js-based Facebook Messenger bot framework with modular commands, event handlers, and pluggable data storage (SQLite and MongoDB). Ships with a large set of commands under `scripts/cmds` and a custom `fb-chat-api` implementation for interacting with Messenger.

**Developed By Redwan Ahemed — https://GitHub.com/xemonbae01/Anchestor-Resynced**

### Key Features
- Modular command system in `scripts/cmds`
- Event handling pipeline in `bot/handler`
- Login flow and token management in `bot/login`
- Data layer with SQLite and MongoDB under `database/`
- Internationalization via `languages/`
- Built-in utilities and logging

### Requirements
- Node.js 18+ (LTS recommended)
- npm installed
- Optional: MongoDB instance if using MongoDB models

### Quick Start
1) Install dependencies:
```bash
npm install
```

2) Configure the bot:
- Update `config.json` for global settings (prefix, admins, language, etc.)
- Put Facebook cookies/appState in `account.txt` (JSON array format)

3) Run the bot:
```bash
node index.js
```

### Configuration
- `config.json`: Main bot configuration (command prefix, global toggles, language)
- `configCommands.json`: Per-command enable/disable and overrides
- `languages/`: Language packs (`en.lang`, `vi.lang`) and helpers

### Data Storage
- `database/data/`: JSON and SQLite data files used by the bot
- `database/models/sqlite` and `database/models/mongodb`: ORM/ODM models
- `database/connectDB/`: Connectors for MongoDB and SQLite

By default, many commands use SQLite/JSON storage. If enabling MongoDB features, ensure `database/connectDB/connectMongoDB.js` is properly configured and your MongoDB is reachable.

### Commands and Events
- Commands live in `scripts/cmds/*.js` and expose `config`, `onStart`, optional `onChat`, and optional `onReply` handlers.
- Events live in `scripts/events/*.js` and are wired through `bot/handler/handlerEvents.js`.

Common commands include `help`, `menu`, `prefix`, `bank`, `kick`, `translate`, `weather`, `top`, and more. See the `scripts/cmds` folder for the full list.

### Project Structure
```
bot/                  # Handlers and login
database/             # Connectors, models, and data files
fb-chat-api/          # Messenger API implementation
languages/            # i18n resources
logger/               # Logging utilities
scripts/              # Commands and events
utils/                # Shared utilities
Anchestor.js          # Core initializer
index.js              # Entry point
config.json           # Main config
configCommands.json   # Per-command config
```

### Running, Debugging, and Logs
- Default entry is `index.js` which spawns `Anchestor.js`.
- Logs are emitted via `logger/` modules.
- Run from the project root: `node index.js`.

### Troubleshooting
- Login issues: Check `bot/login/*` and ensure cookies are valid in `account.txt`.
- Database errors: Confirm file paths in `database/data/` exist and are writable; for MongoDB, verify connection string and network access.
- Command not responding: Ensure it's enabled in `configCommands.json` and not role-restricted in `config.json`.

### Security Notes
- Keep `account.txt` and `bot/data/tokens.json` private.
- Do not commit secrets; use `.gitignore` appropriately.
- Consider environment variables for credentials if deploying.

### Contributing
- Open issues or PRs with a clear description.
- Follow the existing code style and structure; prefer clarity and maintainability.

---
