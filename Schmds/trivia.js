const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('trivia')
      .setDescription('Asks a random trivia question'),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {

    try {
      const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const question = response.data.results[0];

      // Shuffle the answers
      const answers = [...question.incorrect_answers, question.correct_answer];
      const shuffledAnswers = answers.sort(() => Math.random() - 0.5);

      // Create buttons with correct syntax
      const buttons = shuffledAnswers.map((answer, index) => 
        new ButtonBuilder()
          .setCustomId(`answer_${index}`) // Corrected this line
          .setLabel(answer)
          .setStyle(ButtonStyle.Primary)
      );

      const row = new ActionRowBuilder().addComponents(buttons);

      const embed = new EmbedBuilder()
        .setTitle('Trivia Question')
        .setDescription(question.question)
        .setColor('#FF6347');

      const msg = await interaction.reply({ embeds: [embed], components: [row] });

      const filter = i => i.customId.startsWith('answer_') && i.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async i => {
        const selectedIndex = parseInt(i.customId.split('_')[1], 10);
        const selectedAnswer = shuffledAnswers[selectedIndex];

        if (selectedAnswer === question.correct_answer) {
          await i.update({ content: '✅ Correct answer!', components: [], embeds: [embed] });
        } else {
          await i.update({ content: '❌ Incorrect answer!', components: [], embeds: [embed] });
        }
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          interaction.editReply({ content: '⏳ Time is up! The trivia question is now closed.', components: [] });
        }
      });
    } catch (error) {
      await interaction.reply('Sorry, I couldn\'t fetch trivia at the moment.');
    }
  },
};
