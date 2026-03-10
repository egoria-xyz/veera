// /Events/ready.js

const { Events, ActivityType } = require('discord.js');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });

let onlinePlayers = "0";
let maxPlayers = "2026";

const status = [
    "✨ mc.egoria.xyz - 1.21.11",
    "🙎‍♂️ Nous recrutons ! Rendez-vous sur discord.egoria.xyz",
    `🔥 ${onlinePlayers}/${maxPlayers} joueurs en ligne`,
    "🌐 discord.egoria.xyz",
    "🧊 mc.egoria.xyz - Giveaways / Minecraft Vanilla / 1.21.11"
];

function randomStatus(statusList) {
    return statusList[Math.floor(Math.random() * statusList.length)];
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        // -- Charger les commandes slash
        console.log(color.green("📁 → Loading (/) commands..."));
        await require('../Handlers/commands')(client);

        // -- Déployer les commandes slash.
        await require('../Modules/deploy')(client);

        console.log(color.green(`🚩 → Ready! Logged in as ${client.user.tag}`));

        // -- Définir le status du bot immédiatement puis toutes les 5 minutes
        const updateStatus = () => {
            client.user.setActivity(randomStatus(status), { type: ActivityType.Custom })
        };

        updateStatus();
        setInterval(updateStatus, 5 * 60 * 1000);
    }
}