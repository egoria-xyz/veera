// /Events/guildMemberAdd.js

const { Events, EmbedBuilder } = require('discord.js');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,

    async execute (member) {
        const userName = member.user.username;
        const channel = member.guild.channels.cache.get(process.env.WLCM_CHANNEL)

        console.log(color.green(`📁 → ${userName} just joined the serveur.`));

        const serverEmbed = new EmbedBuilder()
            .setColor(0x6B9071)
            .setTitle(`\➕ ${userName}`)
        
        await channel.send({ embeds: [serverEmbed] });
    }
}