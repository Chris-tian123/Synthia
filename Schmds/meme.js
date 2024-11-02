const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('meme')
      .setDescription('Fetch a random meme from a specific category.')
      .addStringOption(option =>
        option
          .setName('category')
          .setDescription('The category to get the meme from (e.g., Animals, linux, programming).')
          .setRequired(true)
          .addChoices(
            { name: 'animals', value: 'AnimalMemes' },
            { name: 'crypto', value: 'cryptomemes' },
            { name: 'discord', value: 'discordmemes' },
            { name: 'linux', value: 'linuxmemes' },
            { name: 'minecraft', value: 'minecraftmemes' },
            { name: 'programming', value: 'codingmemes' },
            { name: 'science', value: 'sciencememes' }
          )
      ),
    integration_types: [1],
    contexts: [0, 1, 2],
  },

  async execute(interaction) {
    await interaction.deferReply();

    const category = interaction.options.getString('category');
    try {
      const response = await axios.get(`https://memesapi.vercel.app/give/${category}/20`);

      if (!response.data || !response.data.memes || response.data.memes.length === 0) {
        return interaction.editReply('Could not fetch any memes. Please try again later.');
      }

      // Select a random meme from the list
      const randomIndex = Math.floor(Math.random() * response.data.memes.length);
      const meme = response.data.memes[randomIndex];

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(meme.title)
        .setImage(meme.url);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching meme:', error);
      await interaction.editReply('There was an error fetching the meme. Please try again later.');
    }
  },
};
