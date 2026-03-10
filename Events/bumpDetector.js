// /Events/bumpDetector.js

const { Events, EmbedBuilder } = require('discord.js');
const color = require('colors');

const DISBOARD_ID = '302050872383242240';
const BUMP_COOLDOWN = 2 * 60 * 60 * 1000;
const BUMP_ROLE_ID = process.env.BUMP_ROLE_ID;

// Stockage des timers en mémoire (remplacer par DB pour persistance)
const bumpTimers = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // On écoute aussi les messages pour détecter DISBOARD
    }
};