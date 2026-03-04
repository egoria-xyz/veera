// /Handlers/commands.js

const { Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('node:path');
const color = require('colors');

module.exports = async (client) => {
    client.commands = new Collection();
    const commands = [];

    const commandsPath = path.join(__dirname, '..', 'Commands');

    if(!fs.existsSync(commandsPath)) {
        console.log(color.yellow("⚠️ → The commands folder does not exist. Creating it..."));
        fs.mkdirSync(commandsPath, { recursive: true });
        console.log('📁 → Commands folder created!');
        return;
    }
    
    const commandFolder = fs.readdirSync(commandsPath);

    for(const folder of commandFolder) {
        const folderPath = path.join(commandsPath, folder);

        if(!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
                // J'ai commenté cette partie pour éviter de spam les logs.
                // console.log(color.green(`📁 → Commande chargée: ${command.data.name} (${folder})`));
            } else {
                console.log(color.red(`🚩 → The ${file} command must have properties such as "data" and "execute."`));
            }
        }
    }

    console.log(color.green(`📁 → ${client.commands.size} command(s) loaded`));
}