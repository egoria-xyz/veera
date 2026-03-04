const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction) {
        const response = await interaction.reply({
            content: '🏓 Mesure en cours...',
            withResponse: true,
        });

        const message = response.resource.message;

        const botPing = message.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);

        await interaction.editReply({
            content: `🏓 **Pong !**  
└─ Latence bot : **${botPing}** ms  
└─ Latence API Discord : **${apiPing}** ms`
        });
    },
};