const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("quote")
      .setDescription("Get a random inspirational quote"),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {
    try {
      // Defer reply while waiting for the API response
    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      ephemeral: true,
      flags: [4096],
    });


      // API request to get a random quote (this example uses the zenquotes.io API)
      const response = await axios.get('https://zenquotes.io/api/random');

      // Extract the quote and author from the response
      const quote = response.data[0].q;
      const author = response.data[0].a;

      // Create an embed with the quote
      const embed = new EmbedBuilder()
        .setColor('#00FF00') // You can set the color of the embed
        .setTitle('🌟 Inspirational Quote')
        .setDescription(`"${quote}"`)
        .setFooter({ text: `- ${author}` });

      // Edit the deferred reply with the quote embed
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching the quote:", error);

      // Send an error message if something goes wrong
      await interaction.editReply({
        content: 'Sorry, there was an issue fetching a quote. Please try again later.',
        ephemeral: true, // Make the error message visible only to the user
      });
    }
  },
};
