// ./Handlers/ticketSystem.js

const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const ticketConfig = require('../Modules/ticketSystem');
var color = require('colors/safe');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select') {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const ticketType = interaction.values[0];
            const ticketInfo = ticketConfig.ticketTypes[ticketType];
            const userName = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const channelName = `${ticketType}-${userName}`;

            const existingTicket = interaction.guild.channels.cache.find(
                channel => channel.name === channelName && channel.parentId === ticketConfig.ticketCategoryId
            );

            if (existingTicket) {
                return interaction.editReply({
                    content: `🚩 → Vous avez déjà un ticket ouvert : <#${existingTicket.id}>`,
                });
            }

            try {
                const permissions = [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks
                        ],
                    },
                ];

                ticketConfig.staffRoleIds.forEach(roleId => {
                    permissions.push({
                        id: roleId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory,
                            PermissionFlagsBits.AttachFiles,
                            PermissionFlagsBits.EmbedLinks,
                            PermissionFlagsBits.ManageMessages
                        ],
                    });
                });

                // Créer le salon de ticket
                const ticketChannel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: ticketConfig.ticketCategoryId,
                    permissionOverwrites: permissions,
                    topic: `Ticket ${ticketInfo.label} de ${interaction.user.tag} | ID: ${interaction.user.id} | Date d'ouverture: <t:${Math.floor(Date.now() / 1000)}:F>`
                });

                // Créer l'embed de bienvenue
                const welcomeEmbed = new EmbedBuilder()
                    .setColor(`#5865F2`)
                    .setTitle(`${ticketInfo.emoji} Ticket ${ticketInfo.label}`)
                    .setDescription(
                        `
                        Bonjour ${interaction.user},\n\n
                        
                        Merci d'avoir ouvert un ticket. Un membre de l'équipe va vous répondre dans les plus brefs délais.\n\n
                        
                        **Type de ticket :** ${ticketInfo.label}\n
                        **Créé le :** <t:${Math.floor(Date.now() / 1000)}:F>
                        `
                    )
                    .setFooter({ text: 'Merci de décrire votre demande en détail' })
                    .setTimestamp();

                // Bouton pour fermer le ticket
                const closeButton = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fermer le ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder().addComponents(closeButton);

                // Mentionner les staff
                const staffMentions = ticketConfig.staffRoleIds.map(id => `<@&${id}>`).join(' ');

                await ticketChannel.send({
                    content: `${interaction.user} ${staffMentions || ''}`,
                    embeds: [welcomeEmbed],
                    components: [row]
                });

                await interaction.editReply({
                    content: `✅ → Votre ticket a été créé : <#${ticketChannel.id}>`,
                });

                console.log(color.green(`✅ → Ticket créé: ${channelName} par ${interaction.user.tag}`));

            } catch (error) {
                console.error(color.red('⚠️ → Erreur lors de la création du ticket:'), error);
                await interaction.editReply({
                    content: '⚠️ → Une erreur est survenue lors de la création du ticket.',
                });
            }
        }

        // Gestion du bouton de fermeture
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            // Vérifier si c'est bien un salon de ticket
            if (interaction.channel.parentId !== ticketConfig.ticketCategoryId) {
                return interaction.reply({
                    content: '⚠️ → Cette commande ne peut être utilisée que dans un ticket.',
                    flags: MessageFlags.Ephemeral
                });
            }

            // Vérifier si l'utilisateur est staff
            const isStaff = ticketConfig.staffRoleIds.some(roleId => 
                interaction.member.roles.cache.has(roleId)
            ) || interaction.member.permissions.has(PermissionFlagsBits.Administrator);

            if (!isStaff) {
                return interaction.reply({
                    content: '⚠️ → Seul le staff peut fermer les tickets.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const confirmEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔒 Fermeture du ticket')
                .setDescription(`Ce ticket va être fermé dans 5 secondes...\nFermé par ${interaction.user}`)
                .setTimestamp();

            await interaction.reply({ embeds: [confirmEmbed] });

            setTimeout(async () => {
                try {
                    await interaction.channel.delete();
                    console.log(color.yellow(`🔒 → Ticket fermé par ${interaction.user.tag}`));
                } catch (error) {
                    console.error(color.red('⚠️ →  Erreur lors de la fermeture du ticket:'), error);
                }
            }, 5000);
        }
    },
};
