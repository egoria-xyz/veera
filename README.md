<div align="center">

<img src="https://img.shields.io/badge/Veera-Bot-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Veera Bot"/>

# 🤖 Veera

**The official Discord bot for the EgoriaMC Minecraft server.**  
Moderation, server management & Minecraft integration — all in one bot.

[![Version](https://img.shields.io/badge/version-5.4.2-blue?style=flat-square)](https://github.com/egoria-xyz/veera/releases)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org)
[![License](https://img.shields.io/badge/license-BSL--1.0-orange?style=flat-square)](./LICENSE)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com)

---

*⛏️ EgoriaMC — Vanilla Minecraft 1.21.11 — Cracked friendly*

</div>

---

## 📋 Table of Contents

- [🤖 Veera](#-veera)
  - [📋 Table of Contents](#-table-of-contents)
  - [🌐 Overview](#-overview)
  - [✨ Features](#-features)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Prerequisites](#-prerequisites)
  - [🚀 Installation](#-installation)
  - [⚙️ Configuration](#️-configuration)
  - [🎮 Commands](#-commands)
    - [🛡️ Moderation](#️-moderation)
    - [⚙️ Utilities](#️-utilities)
    - [🎫 Egoria (Admin)](#-egoria-admin)
  - [📡 Events](#-events)
    - [🎫 Ticket Categories](#-ticket-categories)
  - [🧰 Tech Stack](#-tech-stack)
  - [👤 Author](#-author)
  - [📄 License](#-license)

---

## 🌐 Overview

**Veera** is the official multipurpose Discord bot for the **EgoriaMC** Minecraft server (`mc.egoria.xyz`). It handles server moderation, member management, a ticket system, and Disboard bump reminders — with Minecraft RCON integration planned.

---

## ✨ Features

| Feature | Status | Description |
|---|---|---|
| 🛡️ Moderation | ✅ Live | Ban, kick, unban, clear messages |
| 🎫 Ticket System | ✅ Live | Support tickets with categories & staff roles |
| 👋 Welcome Messages | ✅ Live | Auto-greets new members |
| 🔔 Bump Reminder | ✅ Live | Disboard auto-reminder every 2 hours |
| 🏓 Ping | ✅ Live | Bot & API latency check |
| ⛏️ Minecraft Integration | 🚧 Planned | RCON bridge & player stats |

---

## 📁 Project Structure

```
veera/
├── main.js                   # Entry point — loads events & starts the bot
├── .env                      # Environment variables (not committed)
├── .env.example              # Environment variable template
│
├── Commands/
│   ├── Egoria/
│   │   └── setup-ticket.js   # Sets up the ticket panel (Admin only)
│   ├── Moderation/
│   │   ├── ban.js            # Ban a member
│   │   ├── kick.js           # Kick a member
│   │   ├── unban.js          # Revoke a ban
│   │   └── clear.js          # Bulk delete messages
│   └── Utiles/
│       └── ping.js           # Bot & API latency
│
├── Events/
│   ├── ready.js              # Bot startup, status rotation, command deploy
│   ├── interactionCreate.js  # Slash command handler
│   ├── messageCreate.js      # Disboard bump detection
│   ├── guildMemberAdd.js     # Welcome message on join
│   └── ticketOpened.js       # Ticket creation & closing logic
│
├── Handlers/
│   └── commands.js           # Loads slash commands into the client
│
└── Modules/
    ├── database.js           # MySQL2 connection pool
    ├── deploy.js             # Auto-deploys slash commands (guild or global)
    └── ticketSystem.js       # Ticket configuration (categories, types, staff)
```

---

## 🔧 Prerequisites

- [Node.js](https://nodejs.org) `v18` or higher
- [npm](https://www.npmjs.com) `v9` or higher
- A MySQL database
- A Discord bot application ([Discord Developer Portal](https://discord.com/developers/applications))

---

## 🚀 Installation

**1. Clone the repository**
```bash
git clone https://github.com/egoria-xyz/veera.git
cd veera
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up your environment**
```bash
cp .env.example .env
# Then edit .env with your values
```

**4. Start the bot**
```bash
node main.js
```

> Slash commands are **automatically deployed** on startup — no separate deploy step needed.

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in your values:

```env
# Bot credentials
APP_TOKEN=your_bot_token_here
APP_ID=your_application_id

# EgoriaMC API
EGORIA_KEY=your_api_key

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_PORT=3306
DB_NAME=veera

# Discord IDs
GUILD_ID=           # Leave empty for global command deployment
WLCM_CHANNEL=       # Channel ID for welcome messages

# Minecraft RCON
RCON_HOST=mc.egoria.xyz
RCON_PORT=25575
RCON_PASS=your_rcon_password
```

> ℹ️ If `GUILD_ID` is set, commands deploy **instantly** (guild-only, for development).  
> If left empty, commands deploy **globally** (can take up to 1 hour).

---

## 🎮 Commands

### 🛡️ Moderation

| Command | Permission | Description |
|---|---|---|
| `/ban <user> <reason>` | `BAN_MEMBERS` | Bans a member from the server |
| `/kick <user> <reason>` | `KICK_MEMBERS` | Kicks a member from the server |
| `/unban <user> <reason>` | `BAN_MEMBERS` | Revokes a member's ban |
| `/clear <amount> [user]` | `MANAGE_MESSAGES` | Deletes up to 100 messages, optionally filtered by user |

> All moderation actions are logged to a dedicated audit channel via embed.

### ⚙️ Utilities

| Command | Permission | Description |
|---|---|---|
| `/ping` | Everyone | Displays bot latency and Discord API latency |

### 🎫 Egoria (Admin)

| Command | Permission | Description |
|---|---|---|
| `/setup-ticket` | `ADMINISTRATOR` | Deploys the ticket panel in the configured channel |

---

## 📡 Events

| Event | Description |
|---|---|
| `ready` | Starts the bot, deploys commands, rotates status every 5 minutes |
| `interactionCreate` | Routes slash commands and handles ticket interactions |
| `messageCreate` | Detects Disboard bump confirmations and schedules a 2-hour reminder |
| `guildMemberAdd` | Sends a welcome embed when a new member joins |
| `ticketOpened` | Handles ticket creation (with category & permissions) and closing |

### 🎫 Ticket Categories

| Type | Emoji | Description |
|---|---|---|
| Recrutement | ➕ | Apply to join the staff team |
| Signalement | 🚨 | Report a player, bug, or error |
| Boutique | 🛒 | Shop-related inquiries |
| Autre | 🎫 | Any other request |

---

## 🧰 Tech Stack

| Technology | Version | Usage |
|---|---|---|
| [Node.js](https://nodejs.org) | 18+ | Runtime |
| [discord.js](https://discord.js.org) | ^14.25.1 | Discord API wrapper |
| [mysql2](https://github.com/sidorares/node-mysql2) | ^3.18.2 | Database connection |
| [rcon-client](https://github.com/janispritzkau/rcon-client) | ^4.2.5 | Minecraft RCON (planned) |
| [axios](https://axios-http.com) | ^1.13.5 | HTTP client for EgoriaMC API |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.3.1 | Environment variable management |
| [colors](https://github.com/Marak/colors.js) | ^1.4.0 | Colored console output |

---

## 👤 Author

**neophit** — [GitHub](https://github.com/egoria-xyz/veera)

---

## 📄 License

This project is licensed under the **Boost Software License 1.0**.  
See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with ❤️ for **EgoriaMC** · `mc.egoria.xyz` · `discord.egoria.xyz`

</div>
