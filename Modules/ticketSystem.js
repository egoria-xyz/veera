// ./Config/tickets.js

module.exports = {
    ticketChannelId: '1467642371104833610',
    ticketCategoryId: '1467642370911637726',
    
    staffRoleIds: [
        '1467642369972113570', // Guide Team
    ],
    
    ticketTypes: {
        recrutement: {
            label: 'Recrutement',
            description: 'Entrer dans l\'équipe du serveur.',
            emoji: '➕'
        },
        signalement: {
            label: 'Signalement',
            description: 'Signaler un joueur / bug / erreur.',
            emoji: '🚨'
        },
        boutique: {
            label: 'Boutique',
            description: 'Pour toute demande relative à la boutique.',
            emoji: '🛒'
        },
        autre: {
            label: 'Autre demande',
            description: 'Pour toute autre demande, ouvrez ce ticket.',
            emoji: '🎫'
        },
    }
};
