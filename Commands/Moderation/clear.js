// ./Commands/Admin/clear.js

const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
var color = require('colors/safe');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Permet aux modérateurs de supprimer des messages d\'un salon')
        .addIntegerOption(option =>
            option
                .setName('nombre')
                .setDescription('Le nombre de messages à supprimer (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription('Supprimer uniquement les messages d\'un utilisateur (optionnel)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('nombre');
        const targetUser = interaction.options.getUser('utilisateur') || null;
        const channel = interaction.client.channels.cache.get("1465526781430861912");

        try {
            let messages = await interaction.channel.messages.fetch({ limit: 100 });

            if (targetUser) {
                messages = messages.filter(msg => msg.author.id === targetUser.id).first(amount);
            } else {
                messages = messages.first(amount);
            }

            const deleted = await interaction.channel.bulkDelete(messages, true);

            const embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username + " 🗑️ Messages supprimés", IconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor('#FF0000')
                .setTimestamp()
                .addFields(
                    { name: "Nombre de messages supprimés: ", value: `> ${deleted.size}`, inline: true },
                    { name: "Utilisateur ciblé?", value: targetUser ? `> ${targetUser}` : '> \\❌', inline: true }
                )

            await channel.send({ embeds: [embed] });
            return interaction.reply({ content: `🗑️ → ${deleted.size} messages ${targetUser ? ` de ${targetUser}` : ''} ont été supprimés`, flags: MessageFlags.Ephemeral });

        } catch (error) {
            console.error(color.red('⚠️ → Erreur lors de la suppression des messages:'), error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('⚠️ Erreur')
                .setDescription('Une erreur est survenue lors de la suppression des messages.')
                .setColor('#FF0000')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
