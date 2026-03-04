// Commands/Moderation/ban.js
const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const color = require('colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permet à un modérateur du serveur de bannir un utilisateur de Egoria.')
        .addUserOption(option =>
            option
                .setName('utilisateur')
                .setDescription('Utilisateur à bannir. (ou ID Discord de l\'utilisateur)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('raison')
                .setDescription("Raison du bannissement de l'utilisateur.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (!interaction.inGuild()) { // Si la commande est exécutée hors du serveur on ignore
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) { // Si l'utilisateur n'a pas la permission de bannir les membres on ignore
            return;
        }

        const me = interaction.guild.members.me;
        if (!me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "🚩 → Je n'ai pas la permission de bannir des membres sur le serveur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        const targetUser = interaction.options.getUser('utilisateur', true);
        const reason = interaction.options.getString('raison', true) + ` || Banni par (ID: ${interaction.user.id}) (Pseudo: ${interaction.user.username})`;
        const channel = interaction.client.channels.cache.get("1465526781430861912");

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité de vous bannir vous-même."});
        }

        if (targetUser.id === interaction.client.user.id) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité de me bannir.", flags: MessageFlags.Ephemeral });
        }

        const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
        if (!targetMember) {
            return interaction.reply({ content: "🚩 → Je n'ai pas réussi à trouvé l'utilisateur demandé, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        if (targetMember.id === interaction.guild.ownerId) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas le droit de bannir le Fondateur."});
        }

        const authorHighest = interaction.member.roles?.highest?.position ?? 0; // Récupérer le rôle le plus haut de l'utilisateur
        const targetHighest = targetMember.roles?.highest?.position ?? 0; // récupérer le rôle le plus haut de l'utilisateur à bannir
        const meHighest = me.roles?.highest?.position ?? 0; // Récupérer le rôle le plus haut du bot

        if (authorHighest <= targetHighest && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité de bannir un membre avec un rôle égal ou suppérieur à vous.", flags: MessageFlags.Ephemeral });
        }

        if (meHighest <= targetHighest) {
            return interaction.reply({ content: "🚩 → Ce membre à un rôle qui est au dessus du miens, veuillez contacter le <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        if (!targetMember.bannable) {
            return interaction.reply({ content: "🚩 → Ce membre ne peut pas être banni.", flags: MessageFlags.Ephemeral });
        }

        if (!reason) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas spécifié de raison pour le bannissement de l'utilisateur.", flags: MessageFlags.Ephemeral });
        }

        try {
            await targetMember.ban({ reason }); // Bannir le membre avec la raison

            const banEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username + " - BAN ⚖️", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor(0x9A0002)
                .setFooter({ text: "Un utilisateur a été banni de EgoriaMC", iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                .addFields(
                    { name: "\\🙎‍♂️ **Utilisateur**: ", value: `> <@${targetUser.id}>`, inline: true},
                    { name: "\\🧑‍⚖️ **Sanctionneur**: ", value: `> <@${interaction.user.id}>`, inline: true },
                    { name: "\\📃 **Raison**: ", value: `> *${reason.split(' ||')[0]}*`, inline: false }

                )

            await channel.send({ embeds: [banEmbed] });
            return interaction.reply({ content: `⚖️ → L'utilisateur ${targetUser.username} a bien été banni du serveur pour la raison suivante: \n${reason.split(' ||')[0]}`, flags: MessageFlags.Ephemeral });
        } catch {
            console.log(color.red(`🚩 → An error occured during execution of the ban of ${target.username}: `, error));
            return interaction.reply({ content: "🚩 → Une erreur est survenue lors du bannissement de l'utilisateur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }
    },
};