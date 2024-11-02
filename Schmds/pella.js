const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('pella')
      .setDescription('Learn more about Pella.app and host your bots effortlessly'),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      flags: [4096],
    });

    // Create a button linking to Pella.app
    const button = new ButtonBuilder()
      .setLabel('Visit Pella.app right now')
      .setStyle('5')
      .setURL('https://pella.app'); // Pella.app link

    // Create an action row to hold the button
    const actionRow = new ActionRowBuilder().addComponents(button);

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle('Discover Pella.app')
      .setURL('https://pella.app')
      .setDescription("Looking for a way to host your Discord bots without the hassle? Check out Pella.app! It's a platform that simplifies bot hosting, so you can focus on creating awesome bots.")
      .setColor('#60fffb')
      .addFields(
        {
          name: 'Why Pella.app?',
          value: (
            "Pella.app makes your life easier with:\n" +
            "- **Easy Setup**: Deploy bots quickly without complicated steps.\n" +
            "- **Reliable Uptime**: Ensure your bots stay online and ready.\n" +
            "- **Secure Environment**: Prioritizing security to protect your data.\n" +
            "- **Integration Support**: Compatible with multiple frameworks.\n"
          ),
          inline: false,
        },
        {
          name: 'Getting Started is a Breeze',
          value: (
            "1. **Sign Up**: Create an account in minutes.\n" +
            "2. **Create a Project**: Set up your bot project on GitHub.\n" +
            "3. **Deploy Your Bot**: Select your repo and let Pella.app handle the rest.\n" +
            "4. **Monitor & Manage**: Use the dashboard to monitor your bot's performance.\n"
          ),
          inline: false,
        },
        {
          name: 'Things to Keep in Mind',
          value: (
            "- **Cost**: Check out the pricing plans to fit your needs.\n" +
            "- **Compatibility**: Make sure your bot's language and dependencies are supported.\n"
          ),
          inline: false,
        }
      )
      .setFooter({ text: 'Have questions? Reach out to Pella.app support anytime!' })
      .setThumbnail('https://images-ext-1.discordapp.net/external/kbQMDePCWJLgpXqzDh2wjTGcH6gmxizLpBMLAwPscQo/https/cdn.discordapp.com/icons/1239329064842432562/da5e8b8e3b9ed106626e9c7d525e04a8.webp?format=webp&width=115&height=115'); // Placeholder for logo

    // Reply to the interaction with the embed and button, ephemeral for only the user to see
    await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true });
  }
};