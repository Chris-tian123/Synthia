const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Groq client with API key from environment variable
const groq = new Groq({ apiKey: "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"});

// Initialize GoogleGenerativeAI client with API key from environment variable
const genAI = new GoogleGenerativeAI({ apiKey: "AIzaSyBUkSjeYDmT5lnaXWUh9s1OYakzjnXlmh4" });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask-ai')
    .setDescription('Ask the AI a question using Groq or Google Gemini')
    .addStringOption((option) =>
      option
        .setName('question')
        .setDescription('What do you want to ask the AI?')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('model')
        .setDescription('Choose the AI model to use')
        .setRequired(true)
        .addChoices(
          { name: 'Llama3-8b-8192', value: 'llama3-8b-8192' },
          { name: 'Gemma-7b-it', value: 'gemma-7b-it' },
          { name: 'Mixtral-8x7b-32768', value: 'mixtral-8x7b-32768' },
          { name: 'Gemini-1.5-flash', value: 'gemini' }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const question = interaction.options.getString('question');
    const selectedModel = interaction.options.getString('model');

    try {
      let responseText;

      if (selectedModel === 'llama3-8b-8192' || selectedModel === 'gemma-7b-it' || selectedModel === 'mixtral-8x7b-32768') {
        // Groq AI response
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: 'Provide a brief response.' },
            { role: 'user', content: question },
          ],
          model: selectedModel,
        });
        responseText = chatCompletion.choices[0]?.message?.content || 'No response from Groq AI.';
      } else if (selectedModel === 'gemini') {
        // Google Gemini AI response
        const geminiResponse = await selectedModel.generateText({ prompt: question });
        responseText = geminiResponse?.candidates[0]?.output || 'No response from Google Gemini.';
      };

      // Create the embed for the response
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setDescription(responseText);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error with AI:', error);
      await interaction.editReply({
        content: 'There was an error processing your request. Please try again later.',
      });
    }
  },
};
