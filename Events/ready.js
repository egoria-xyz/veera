// /Events/ready.js

const { Events, ActivityType } = require('discord.js');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        // Définir le status du bot.
        client.user.setActivity("✨ mc.egoria.xyz - 1.21.11", { type: ActivityType.Custom });

        // Charger les commandes slash
        console.log(color.green("📁 → Loading (/) commands..."));
        await require('../Handlers/commands')(client);

        // Déployer les commandes slash.
        await require('../Modules/deploy')(client);
        
        console.log(color.green(`🚩 → Ready! Logged in as ${client.user.tag}`));
    }
}