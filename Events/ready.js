// /Events/ready.js

const { Events, ActivityType } = require('discord.js');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });

const status = [
    "✨ mc.egoria.xyz - 1.21.11",
    "🙎‍♂️ Nous recrutons ! Rendez-vous sur discord.egoria.xyz",
    `🔥 ${onlinePlayers}/${maxPlayers} joueurs en ligne`,
    "🌐 discord.egoria.xyz",
    "🧊 mc.egoria.xyz - Giveaways / Minecraft Vanilla / 1.21.11"
]

function randomStatus(status) {
    status[Math.floor(Math.random() * status.length)];
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        // -- Définir le status du bot.
        setTimeout(async () => {
            client.user.setActivity(randomStatus, { type: ActivityType.Custom });
        }, 5 * 60 * 1000); // toutes les 5 minutes

        // -- Charger les commandes slash
        console.log(color.green("📁 → Loading (/) commands..."));
        await require('../Handlers/commands')(client);

        // -- Déployer les commandes slash.
        await require('../Modules/deploy')(client);
        
        console.log(color.green(`🚩 → Ready! Logged in as ${client.user.tag}`));
    }
}