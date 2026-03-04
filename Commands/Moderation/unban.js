const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const color = require('colors');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Permet à un modérateur du serveur de révoquer le bannissement d\'un utilisateur.')
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("Utilisateur à unban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("raison")
                .setDescription("Raison de la révocation")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            return;
        }

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) {
            return;
        }

        const me = interaction.guild.members.me;
        if (!me?.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: "🚩 → Je n'ai pas la permission de bannir des membres sur le serveur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }

        if (!reason) {
            return interaction.reply({ content: "🚩 → Vous n'avez pas spécifié de raison pour le débannissement de l'utilisateur.", flags: MessageFlags.Ephemeral });
        }

        try {
            await interaction.guild.members.unban(target.id, { reason });

            console.log(color.green(`🛡️ → The user ${target.username} was unban by ${interaction.user.username} for the reason: ${reason}`));

            const unbanEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username + " - UNBAN ⚖️", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setColor(0x9CA764)
                .setFooter({ text: "Un utilisateur a été débanni de EgoriaMC", iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
                .addFields(
                    { name: "\\🙎‍♂️ **Utilisateur**: ", value: `> <@${target.id}>`, inline: true },
                    { name: "\\🧑‍⚖️ **Staff**: ", value: `> <@${interaction.user.id}>`, inline: true },
                    { name: "\\📃 **Raison**: ", value: `> *${reason}*`, inline: false }

                )

            await channel.send({ embeds: [unbanEmbed] });

            return interaction.reply({
                content: `⚖️ → L'utilisateur ${target.username} a été débanni pour la raison suivante : ${reason}`,
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.log(color.red(`🚩 → An error occured during execution of the uban of ${target.username}: `, error));
            return interaction.reply({ content: "🚩 → Une erreur est survenue lors du débannissement de l'utilisateur, veuillez contacter un <@&1465526509384110166>.", flags: MessageFlags.Ephemeral });
        }
    },
};