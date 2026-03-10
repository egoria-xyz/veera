// /Events/messageCreate.js

require('dotenv').config({ quiet: true, debug: false });
const { Events, EmbedBuilder } = require('discord.js');
const color = require('colors');

const DISBOARD_ID = '302050872383242240';
const BUMP_COOLDOWN = 2 * 60 * 60 * 1000; // 2 heures
const bumpTimers = new Map();

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // -- Vérifier que c'est bien DISBOARD qui répond
        if (message.author.id !== DISBOARD_ID) return;
        if (!message.interaction) return;

        // -- Vérifier que c'est bien la commande /bump
        if (message.interaction.commandName !== 'bump') return;

        const bumper = message.interaction.user;
        const guild = message.guild;

        // -- Vérifier si l'embed contient la confirmation de bump
        const embed = message.embeds?.[0];
        const isBumpSuccess = embed?.description?.toLowerCase().includes('bump done') 
            || embed?.description?.toLowerCase().includes('bumped')
            || embed?.description?.includes('Bump');

        if (!isBumpSuccess) return;

        console.log(color.cyan(`🔔 → Bump détecté par ${bumper.tag}`));

        // -- Annuler le timer précédent si existant
        if (bumpTimers.has(guild.id)) {
            clearTimeout(bumpTimers.get(guild.id));
        }

        // -- Embed de confirmation pour l'utilisateur
        const confirmEmbed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('✅ Merci pour le bump !')
            .setDescription(`Merci ${bumper} d'avoir bump le serveur sur DISBOARD !\n\n⏰ Tu seras notifié **dans 2 heures** quand tu pourras re-bump.`)
            .setThumbnail(bumper.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'DISBOARD Bump System' })
            .setTimestamp();

        await message.channel.send({ embeds: [confirmEmbed] });

        // -- Timer de 2h pour notifier que le bump est disponible
        const timer = setTimeout(async () => {

            const bumpRole = process.env.BUMP_ROLE_ID 
                ? `<@&${process.env.BUMP_ROLE_ID}>` 
                : bumper.toString();

            const readyEmbed = new EmbedBuilder()
                .setColor(0x57F287)
                .setTitle('🔔 Le bump est disponible !')
                .setDescription(`${bumpRole} Le serveur peut être bump à nouveau !\n\nUtilise la commande \`/bump\` sur **DISBOARD** pour nous aider à gagner en visibilité. 🚀`)
                .addFields(
                    { name: '📌 Comment bumper ?', value: 'Tape simplement \`/bump\` dans n\'importe quel salon.', inline: false }
                )
                .setFooter({ text: 'DISBOARD Bump System' })
                .setTimestamp();

            await message.channel.send({ 
                content: bumpRole, // Mention hors embed pour déclencher la notif du rôle
                embeds: [readyEmbed] 
            });

            bumpTimers.delete(guild.id);

        }, BUMP_COOLDOWN);

        bumpTimers.set(guild.id, timer);
    }
}