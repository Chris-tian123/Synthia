/**
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Vote = require('../models/WouldYouRather'); // Adjust the path to your Vote model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wouldyourather')
        .setDescription('Get a random "Would You Rather" question'),
    async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      ephemeral: true,
      flags: [4096],
    });
        try {
            // Fetch the question from the external API
            const response = await axios.get('https://example.com/api/would-you-rather'); // Replace with your actual API endpoint
            const randomQuestion = response.data; // Assuming the response structure matches
        
            const embed = new EmbedBuilder()
                .setTitle(randomQuestion.question)
                .addFields(
                    { name: 'Option A:', value: randomQuestion.optionA, inline: true },
                    { name: 'Option B:', value: randomQuestion.optionB, inline: true }
                )
                .setColor('#4e54c8');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('optionA')
                        .setLabel(randomQuestion.optionA)
                        .setStyle('Primary'),
                    new ButtonBuilder()
                        .setCustomId('optionB')
                        .setLabel(randomQuestion.optionB)
                        .setStyle('Secondary'),
                );

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

            const filter = i => i.customId === 'optionA' || i.customId === 'optionB';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                // Initialize the vote counts
                let voteCountA = 0;
                let voteCountB = 0;

                // Check if the user has already voted for this question
                const existingVote = await Vote.findOne({
                    question: randomQuestion.question,
                    userId: interaction.user.id,
                });

                if (existingVote) {
                    // If a vote exists, update the count
                    if (i.customId === 'optionA') {
                        voteCountA = existingVote.votesA + 1;
                        voteCountB = existingVote.votesB; // Keep existing count for Option B
                    } else {
                        voteCountA = existingVote.votesA; // Keep existing count for Option A
                        voteCountB = existingVote.votesB + 1;
                    }
                    
                    // Update existing vote record
                    await Vote.updateOne(
                        { _id: existingVote._id },
                        { votesA: voteCountA, votesB: voteCountB }
                    );
                } else {
                    // Create a new vote record if it doesn't exist
                    if (i.customId === 'optionA') {
                        voteCountA = 1; // First vote for Option A
                        voteCountB = 0; // No votes for Option B
                    } else {
                        voteCountA = 0; // No votes for Option A
                        voteCountB = 1; // First vote for Option B
                    }

                    const newVote = new Vote({
                        question: randomQuestion.question,
                        optionA: randomQuestion.optionA,
                        optionB: randomQuestion.optionB,
                        votesA: voteCountA,
                        votesB: voteCountB,
                        userId: interaction.user.id,
                    });

                    await newVote.save(); // Save the new vote record
                }

                // Disable buttons
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);

                // Update the embed with the results
                embed.setDescription(`Thanks for voting! Current votes:\nOption A: ${voteCountA}\nOption B: ${voteCountB}`);
                await i.update({ embeds: [embed], components: [row], ephemeral: true });

                collector.stop(); // Stop the collector after one response
            });

            collector.on('end', collected => {
                // Optionally handle what happens when the collector ends
                if (collected.size === 0) {
                    embed.setDescription('Voting timed out.');
                    row.components.forEach(button => button.setDisabled(true)); // Disable buttons
                    interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });
                }
            });

        } catch (error) {
            console.error('Error fetching question:', error);
            await interaction.reply({content: 'There was an error fetching the question. Please try again later.', ephemeral: true});
        }
    },
};
/*/