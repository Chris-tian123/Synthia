const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Collection, ActivityType, REST, Routes, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { readdirSync } = require('fs');
const fs = require('fs');
const mongoose = require('mongoose');
const { ApplicationCommandType } = require('discord-api-types/v10');
const colors = require('colors');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.login('Token');
        client.on('ready', (c) => {
        setInterval(() => {

            let status = [
              {
                name: 'customstatus',
                state: `⚜ add me for entertainment`,
                type: ActivityType.Custom,
              },
            ];
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);

          }, 5000);
    })


client.commands = new Collection();

const commandFiles = fs.readdirSync('./Schmds').filter(file => file.endsWith('.js'));

const commands = [];
for (const file of commandFiles) {
  const command = require(`./Schmds/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken('Token');

(async () => {
  try {
    console.log('Started refreshing global application (/) commands.' .yellow);

    const CLIENT_ID = 'Bot_Client_ID'; 

    await rest.put(
      Routes.applicationCommands(CLIENT_ID), 
      { body: commands },
    );

    console.log('Successfully reloaded global application (/) commands.' . blue);
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! Now it's ready!` .cyan);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
