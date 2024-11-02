const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('support')
      .setDescription('Get the link to join the support server'),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      ephemeral: true,
      flags: [4096],
    });
    const supportServerLink = 'https://is.gd/Synthia'; // Replace with your actual server link

    await interaction.editReply({content: `Hey, need help? Join my support server: ${supportServerLink}`, ephemeral: true});
  },
};
