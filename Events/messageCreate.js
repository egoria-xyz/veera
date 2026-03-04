// /Events/messageCreate.js

require('dotenv').config({ quiet: true, debug: false });
const { Events, EmbedBuilder, time } = require('discord.js');
// const color = require('colors');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if(message.author.bot) return;

        else if(message.author.id === "302050872383242240") {
            const bumpTime = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
            const bumpRoleId = '1468027500138598614';

            const bumpEmbed = new EmbedBuilder()
                .setColor(0x3B5B8A)
                .setDescription(`**Bump validé !** Prochain bump: ${time(bumpTime, 'R')} \🔥`)
            
            message.reply({ embeds: [bumpEmbed] });

            setTimeout(async () => {
                await message.channel.send(`\🔥 <@&${bumpRoleId}> Vous pouvez bump le serveur sur Discord ! (</bump:947088344167366698>)`);
            }, 2 * 60 * 60 * 1000); // Notifie toutes les 2h (Disboard)
        }
    }
}