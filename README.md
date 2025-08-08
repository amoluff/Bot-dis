# Discord Bot Starter

A minimal Discord bot using discord.js v14 with slash commands.

## Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in values:
   - `DISCORD_TOKEN`: Your bot token
   - `CLIENT_ID`: The application/client ID
   - `GUILD_ID` (optional): A development guild ID to register commands quickly

## Register slash commands
- Guild scoped (recommended for dev): ensure `GUILD_ID` is set, then:
  ```bash
  npm run register
  ```
- Global (slower propagation): omit `GUILD_ID` in `.env` and run the same command.

## Run the bot
```bash
npm run dev   # with nodemon
# or
npm start
```

## Docker
Build and run with environment variables:
```bash
docker build -t discord-bot .
docker run --rm -e DISCORD_TOKEN=... -e CLIENT_ID=... -e GUILD_ID=... discord-bot
```