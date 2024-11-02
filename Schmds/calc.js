const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const math = require('mathjs');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('calculator')
      .setDescription('Need help with some math?'),
    integration_types: [1], // Adjust based on your integration needs
    contexts: [0, 1, 2], // Context types for where the command can be used (e.g., guild, global)
  },

  async execute(interaction) {
  try {
    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      ephemeral: true,
      flags: [4096],
    });

      const idPrefix = 'calculator';
      let data = ''; // Store the current calculator input/output

      const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription('```\nResults will be displayed here\n```');

      // Define the button rows for the calculator
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('AC').setCustomId(idPrefix + '_clear').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setLabel('(').setCustomId(idPrefix + '_(').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel(')').setCustomId(idPrefix + '_)').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setLabel('<=').setCustomId(idPrefix + '_backspace').setStyle(ButtonStyle.Primary)
      );

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('1').setCustomId(idPrefix + '_1').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('2').setCustomId(idPrefix + '_2').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('3').setCustomId(idPrefix + '_3').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('/').setCustomId(idPrefix + '_/').setStyle(ButtonStyle.Primary)
      );

      const row2 = new ActionRowBuilder().setComponents(
        new ButtonBuilder().setLabel('4').setCustomId(idPrefix + '_4').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('5').setCustomId(idPrefix + '_5').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('6').setCustomId(idPrefix + '_6').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('*').setCustomId(idPrefix + '_*').setStyle(ButtonStyle.Primary)
      );

      const row3 = new ActionRowBuilder().setComponents(
        new ButtonBuilder().setLabel('7').setCustomId(idPrefix + '_7').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('8').setCustomId(idPrefix + '_8').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('9').setCustomId(idPrefix + '_9').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('-').setCustomId(idPrefix + '_-').setStyle(ButtonStyle.Primary)
      );

      const row4 = new ActionRowBuilder().setComponents(
        new ButtonBuilder().setLabel('0').setCustomId(idPrefix + '_0').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('.').setCustomId(idPrefix + '_.').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel('=').setCustomId(idPrefix + '_=').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setLabel('+').setCustomId(idPrefix + '_+').setStyle(ButtonStyle.Primary)
      );

      const msg = await interaction.editReply({
        embeds: [embed],
        components: [row, row1, row2, row3, row4],
        ephemeral: true
      });

      // Create a collector for button interactions
      const collector = msg.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: 600000, // 10 minutes
      });

      collector.on('collect', async (i) => {
        const id = i.customId;
        const value = id.split('_')[1];
        let extra = '';

        if (value === '=') {
          try {
            data = math.evaluate(data).toString(); // Evaluate the expression
          } catch (e) {
            data = '';
            extra = "An error occurred. Please click 'AC' to reset.";
          }
        } else if (value === 'clear') {
          data = ''; // Reset data
          extra = 'Results will be displayed here';
        } else if (value === 'backspace') {
          data = data.slice(0, -1); // Remove last character
        } else {
          const lastChar = data[data.length - 1];
          data += ((parseInt(value) == value || value === '.') && (lastChar == parseInt(lastChar) || lastChar === '.') || data.length === 0 ? '' : ' ') + value;
        }

        // Update the message with the new result or display an error
        await i.update({
          embeds: [
            new EmbedBuilder()
              .setColor('Blue')
              .setDescription(`\`\`\`\n${data || extra}\n\`\`\``),
          ],
          components: [row, row1, row2, row3, row4],
          ephemeral: true,
        });
      });
    } catch (error) {
      console.error(`An error occurred in the calculator command: ${error}`);
    }
  },
};
