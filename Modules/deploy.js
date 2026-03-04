// /Modules/deploy.js

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const color = require('colors');
require('dotenv').config({ quiet: true, debug: false });

module.exports = async (client) => {

    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'Commands');

    if (!fs.existsSync(commandsPath)) {
        console.log(color.red("🚩 → Commands folder can't be found."));
        return;
    }

    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {

        const folderPath = path.join(commandsPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {

            const filePath = path.join(folderPath, file);

            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);

            if ('data' in command && typeof command.data.toJSON === 'function') {
                commands.push(command.data.toJSON());
            } else {
                console.log(color.red(`🚩 → The ${file} command must have properties such as "data" and "execute."`));
            }
        }
    }

    if (!process.env.APP_TOKEN) {
        console.log(color.red(`🚩 → The "APP_TOKEN" is missing.`));
        return;
    }

    const rest = new REST({ version: '10' }).setToken(process.env.APP_TOKEN);

    try {

        console.log(color.green(`📁 → Deploying ${commands.length} slash commands...`));

        if (process.env.GUILD_ID) {
            // Déploiement instantané (DEV)
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
                { body: commands }
            );

            console.log(
                color.green(`📁 → ${commands.length} command(s) deployed.`)
            );

        } else {
            // Déploiement global (PROD - peut prendre 1h)
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            console.log(
                color.green(`📁 → ${commands.length} command(s) deployed globaly.`)
            );
        }

    } catch (error) {
        console.error(color.red("🚩 → An error occurred when deploying commands :"), error);
    }
};