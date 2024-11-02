const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("roll")
      .setDescription("Roll a dice and get a random number!")
      .addIntegerOption(option =>
        option
          .setName("sides")
          .setDescription("Number of sides on the dice (default is 6)")
          .setRequired(false)),
    integration_types: [1],
    contexts: [0, 1, 2],
  },

  async execute(interaction) {
    await interaction.deferReply();

    // Get the number of sides from the options or set default to 6
    const sides = interaction.options.getInteger("sides") || 6;

    // Roll the dice
    const rollResult = Math.floor(Math.random() * sides) + 1;

    // Create an embed to show the result
    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle("🎲 Dice Roll")
      .setDescription(`You rolled a **${rollResult}** on a **${sides}-sided** dice!`);

    await interaction.editReply({ embeds: [embed] });
  },
};
