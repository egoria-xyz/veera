// /main.js

const { Client, GatewayIntentBits, partials } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });

const client = new Client({ // Déclarer les intents du bot
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const eventsPath = path.join(__dirname, 'Events'); // Charger les Events reader
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) { // Charger les Handlers
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
        console.log(color.green(`📁 → Executed event: ${event.name} (once)`));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
        console.log(color.green(`📁 → Executed event: ${event.name} (on)`));
    }
}

client.login(process.env.APP_TOKEN); // Démarrer le bot