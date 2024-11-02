const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("shorten-url")
      .setDescription("Shorten a URL with a custom short code using is.gd")
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("The URL you want to shorten (e.g., https://youtube.com)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("shorten-code")
          .setDescription("The custom short code for the URL (min 4 characters)")
          .setRequired(true)
      ),
    integration_types: [1],
    contexts: [0, 1, 2],
  },

  async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      flags: [4096],
      ephemeral: true,
    });


    const url = interaction.options.getString("link");
    const shortCode = interaction.options.getString("shorten-code");

    if (shortCode.length < 4) {
      return interaction.editReply("The custom short code must be at least 4 characters long.");
    }

    try {
      // Make a request to is.gd to shorten the URL with the custom short code
      const response = await axios.get("https://is.gd/create.php", {
        params: {
          format: "json",
          url: url,
          shorturl: shortCode
        },
      });

      if (!response.data || !response.data.shorturl) {
        return interaction.editReply("There was an error creating the shortened URL. Please try again.");
      }

      const shortenedUrl = response.data.shorturl;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("URL Shortened")
        .addFields(
          { name: "Original URL", value: url },
          { name: "Shortened URL", value: shortenedUrl }
        );

      await interaction.editReply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error shortening URL:", error);
      await interaction.editReply({content: "There was an issue with shortening the URL. Please try again later.", ephemeral: true});
    }
  },
};
