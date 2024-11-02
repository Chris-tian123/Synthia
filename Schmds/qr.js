const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("qrcode")
      .setDescription("Generate a QR code for a given text or URL")
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("The content you want to encode in the QR code")
          .setRequired(true)
      ),
    integration_types: [1],
    contexts: [0, 1, 2],
  },

  async execute(interaction) {
    await interaction.deferReply();

    const content = interaction.options.getString("content");

    try {
      // Generate QR code using a third-party service (quickchart.io)
      const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(content)}&size=200`;

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("Generated QR Code")
        .setDescription("Here is your QR code:")
        .setImage(qrCodeUrl);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error generating QR code:", error);
      await interaction.editReply("There was an issue generating the QR code. Please try again later.");
    }
  },
};
