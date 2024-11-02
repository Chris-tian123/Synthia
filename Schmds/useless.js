const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("uselessfact")
      .setDescription("Get a random useless fact to impress your friends!"),
    integration_types: [1],
    contexts: [0, 1, 2],
  },

  async execute(interaction) {
    await interaction.deferReply();

    try {
      // Fetch a random useless fact from the Useless Facts API
      const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
      const fact = response.data.text;

      // Create an embed to display the fact
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Did you know?")
        .setDescription(fact)
        .setFooter({ text: "The most useless fact you'll learn today!" });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching useless fact:", error);
      await interaction.editReply("Couldn't fetch a useless fact at the moment. Try again later.");
    }
  },
};
