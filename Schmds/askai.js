const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Groq = require('groq-sdk');

// Initialize the Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('ask-ai')
      .setDescription('Ask the AI a question using GROQ API')
      .addStringOption((option) =>
        option
          .setName('question')
          .setDescription('What do you want to ask the AI?')
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
      ephemeral: true,
      flags: [4096],
    });

    const { options } = interaction;
    const question = options.getString('question');

    try {
      // Create the chat completion request
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Provide a brief response.' }, // Instruction for brevity
          { role: 'user', content: question },
        ],
        model: 'llama3-8b-8192',
      });

      const responseText = chatCompletion.choices[0]?.message?.content || 'No response from AI.';

      // Create the embed for the response
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(responseText);

      await interaction.editReply({ embeds: [embed] , ephemeral: true});
    } catch (error) {
      console.error('Error with AI:', error);
    }
  },
};
