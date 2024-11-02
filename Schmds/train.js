const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose'); // Ensure you have mongoose installed
const { WouldYouRather } = require('../models/WouldYouRather.js'); // Adjust the path and model name accordingly

module.exports = {
    data: new SlashCommandBuilder()
        .setName('train-api')
        .setDescription('Add a new "Would You Rather" question')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question to ask')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option_a')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option_b')
                .setDescription('Second option')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({
            allowedMentions: {
                repliedUser: false,
            },
      ephemeral: true,
            flags: [4096],
        });

        const question = interaction.options.getString('question');
        const optionA = interaction.options.getString('option_a');
        const optionB = interaction.options.getString('option_b');

        // Create a new instance of your model
        const newQuestion = new WouldYouRather({
            question: question,
            optionA: optionA,
            optionB: optionB,
        });

        try {
            // Save the new question to MongoDB
            await newQuestion.save();
            await interaction.editReply({content: 'Question added successfully!', ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.editReply({content: 'Failed to add the question. Please try again.', ephemeral: true});
        }
    },
};
