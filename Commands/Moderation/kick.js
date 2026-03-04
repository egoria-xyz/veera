const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const color = require('colors/safe');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Permet à un modérateur d\'expulser un membre du serveur.')
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur à expulser (ou ID Discord de l'utilisateur)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("raison")
                .setDescription("Raison de l'expulsion")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.KickMembers)) {
            return;
        }

        const me = interaction.guild.members.me;
        if (!me?.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: "🚩 → Je n'ai pas la permission de d'expulser des membres sur le serveur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        const target = interaction.options.getUser('utilisateur');
        const reason = interaction.options.getString('raison');
        const channel = interaction.client.channels.cache.get("1465526781430861912");

        if (target.id === interaction.user.id) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité de vous expulser vous-même." });
        }

        if (target.id === interaction.client.user.id) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité de m'expulser.", flags: MessageFlags.Ephemeral });
        }

        const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);
        if (!targetMember) {
            return interaction.reply({ content: "🚩 → Je n'ai pas réussi à trouvé l'utilisateur demandé, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        if (targetMember.id === interaction.guild.ownerId) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas le droit de bannir le Fondateur." });
        }

        const authorHighest = interaction.member.roles?.highest?.position ?? 0;
        const targetHighest = targetMember.roles?.highest?.position ?? 0;
        const meHighest = me.roles?.highest?.position ?? 0;

        if (authorHighest <= targetHighest && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas la possibilité d'expulser un membre avec un rôle égal ou suppérieur à vous.", flags: MessageFlags.Ephemeral });
        }

        if (meHighest <= targetHighest) {
            return interaction.reply({ content: "🚩 → Ce membre à un rôle qui est au dessus du miens, veuillez contacter le <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        if (!targetMember.kickable) {
            return interaction.reply({ content: "🚩 → Ce membre ne peut pas être expulsé.", flags: MessageFlags.Ephemeral });
        }

        if (!reason) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas spécifié de raison pour le bannissement de l'utilisateur.", flags: MessageFlags.Ephemeral });
        }

        try {
            await targetMember.kick({ reason });
            const banEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username + " - KICK 🚪", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor(0xEC5E27)
                .setFooter({ text: "Un utilisateur a été expulsé de EgoriaMC", iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                .addFields(
                    { name: "\\🙎‍♂️ **Utilisateur**: ", value: `> <@${target.id}>`, inline: true },
                    { name: "\\🧑‍⚖️ **Sanctionneur**: ", value: `> <@${interaction.user.id}>`, inline: true },
                    { name: "\\📃 **Raison**: ", value: `> *${reason}*`, inline: false }

                )

            await channel.send({ embeds: [banEmbed] });
            return interaction.reply({ content: `⚖️ → L'utilisateur ${target.username} a bien été expulsé du serveur pour la raison suivante: \n${reason}`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.log(color.red(`🚩 → An error occured during execution of the kick of ${target.username}: `, error));
            return interaction.reply({ content: "🚩 → Une erreur est survenue lors de l'expulsion de l'utilisateur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }
    },
};