const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Collection, ActivityType, REST, Routes, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { readdirSync } = require('fs');
const fs = require('fs');
const mongoose = require('mongoose');
const { ApplicationCommandType } = require('discord-api-types/v10');
const colors = require('colors');

// Initialize the bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.login('MTA2MDU3NzQxMTgwNjI2OTQ2MQ.GRc2PG.xR7sfhz1MxvFpEiGN6XwGIfmIVkklTpLXXgCgQ');
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


// Create a collection to store commands
client.commands = new Collection();

// Load command files from Schmds folder
const commandFiles = fs.readdirSync('./Schmds').filter(file => file.endsWith('.js'));

// Register commands from files
const commands = [];
for (const file of commandFiles) {
  const command = require(`./Schmds/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data);
}

// Deploy the commands to Discord globally
const rest = new REST({ version: '9' }).setToken('MTA2MDU3NzQxMTgwNjI2OTQ2MQ.GRc2PG.xR7sfhz1MxvFpEiGN6XwGIfmIVkklTpLXXgCgQ');

(async () => {
  try {
    console.log('Started refreshing global application (/) commands.' .yellow);

    const CLIENT_ID = '1060577411806269461';  // Your bot's client ID

    // Deploy globally
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),  // Register commands globally
      { body: commands },
    );

    console.log('Successfully reloaded global application (/) commands.' . blue);
  } catch (error) {
    console.error(error);
  }
})();

// Event: Ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!` .cyan);
});

// Event: Interaction Create (slash command execution)
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

// Message event listener
// Log in to Discord