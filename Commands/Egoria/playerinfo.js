const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const color = require('colors');
const db = require('../../Modules/database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playerinfo')
        .setDescription('Voir les informations sur un joueur')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription("Utilisateur dont vous souhaitez obtenir les informations")
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('utilisateur');
        const userId = user.id;

        if(!user) return interaction.reply("🚩 → Vous n'avez pas défini l'utilisateur que vous cherchez.");
        if(!interaction.member.roles.cache.has('1465526509384110166')) return;

        try {
            const [rows] = await db.pool.query(
                'SELECT * FROM discordsrv__accounts WHERE discord = ?',
                [userId]
            );

            if(rows.length === 0) {
                return interaction.reply({
                    embeds: [noAccountEmb],
                    flags: MessageFlags.Ephemeral
                });
            }

            const player = rows[0];
            console.log(color.green(`📁 → Player found: ${player.uuid}`));
        } catch (error) {
            console.error(color.red('🚩 → New database error (--playerinfo): ', error));
            return interaction.reply({
                content: '🚩 → Une erreur est survenue lors de la récupération des informations en base de données.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
};