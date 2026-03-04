const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction) {
        const response = await interaction.reply({ // Préparation de la réponse
            content: '🏓 Mesure en cours...',
            withResponse: true,
        });

        const message = response.resource.message; // Prend le message déjà renvoyé à l'utilisateur

        /*
        *  vérification de la date de création
        *  du message (timestamp) moins l'heure
        *  de création de l'interaction (timestamp)
        *  Puis calcul précis du ping de l'API REST DiscordJS
        */
        const botPing = message.createdTimestamp - interaction.createdTimestamp;
        const apiPing = Math.round(interaction.client.ws.ping);

        await interaction.editReply({ // Modifier le message précédent avec les valeurs de ping
            content: `🏓 **Pong !**
└─ Latence bot : **${botPing}** ms
└─ Latence API Discord : **${apiPing}** ms`
        });
    },
};