const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with the bot's current ping"),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
   
  async execute(interaction) {
  try {
    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      flags: [4096],
    });


    const sent = await interaction.editReply({
      content: "🏓 Pinging...",
      fetchReply: true,
    });

    interaction.editReply({
      content: `🏓 Pong! Current ping is ${
        interaction.client.ws.ping
      }ms.`,
      fetchReply: true,
    });
  } catch (error) {
    console.error("Error handling interaction:", error);
  }
 },
};
