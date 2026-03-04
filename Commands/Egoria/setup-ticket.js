// ./Commands/Admin/setup-ticket.js

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const ticketConfig = require('../../Modules/ticketSystem');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('ne pas utiliser.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get(ticketConfig.ticketChannelId); // Récupérer le salon dans la config
        
        if (!channel) { // Si le salon n'existe pas on prévient l'utilisateur
            return interaction.reply({
                content: '🚩 → Le salon de tickets configuré est introuvable !',
                flags: MessageFlags.Ephemeral
            });
        }

        const embed = new EmbedBuilder() // Créer lembed
            .setColor(0xD8D262)
            .setTitle('🎫 Contacter le support')
            .setDescription('Sélectionnez le type de ticket que vous souhaitez ouvrir dans le menu déroulant ci-dessous.\n\n')
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder() // Créer un menu déroulant de sélection
            .setCustomId('ticket_select')
            .setPlaceholder('Sélectionnez un type de ticket')
            .addOptions(
                Object.entries(ticketConfig.ticketTypes).map(([key, value]) => ({
                    label: value.label,
                    description: value.description,
                    value: key,
                    emoji: value.emoji
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu); // Définir et appeler le menun déroulant

        try {
            await channel.send({ // Envoyer l'embed avec le menu déroulant dans le salon
                embeds: [embed],
                components: [row]
            });

            await interaction.reply({
                content: '🚩 → Le système de tickets a été configuré avec succès !',
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.log(color.red(`🚩 → An error occured while trying to setup ticket system: `, error));
            await interaction.reply({
                content: '🚩 → Une erreur est survenue lors de la configuration.',
                flags: MessageFlags.Ephemeral
            });
        }
    },
};
