const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName('remind')
      .setDescription('A reminder/timer system to remind you to do a certain task.')
      .addStringOption((opt) =>
        opt
          .setName('description')
          .setDescription('The task you want to be reminded of.')
          .setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('time')
          .setDescription('The time in seconds')
          .addChoices(
            { name: '60 Secs', value: '60' },
            { name: '2 Minutes', value: '120' },
            { name: '5 Minutes', value: '300' },
            { name: '10 Minutes', value: '600' },
            { name: '15 Minutes', value: '900' },
            { name: '20 Minutes', value: '1200' },
            { name: '30 Minutes', value: '1800' },
            { name: '45 Minutes', value: '2700' },
            { name: '1 Hour', value: '3600' },
            { name: '2 Hours', value: '7200' },
            { name: '3 Hours', value: '10800' },
            { name: '5 Hours', value: '18000' },
            { name: '10 Hours', value: '36000' }
          )
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
    });

    const desc = interaction.options.getString('description');
    const time = interaction.options.getString('time');
    const channel = interaction.channel;

    // Use backticks for template literals and correct the escape sequences
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('A Friendly Reminder')
      .setDescription(`I've set up a reminder for the following:\nTIME: ${time} seconds | ${time * 1000} milliseconds\nTASK/DESCRIPTION: ${desc}`);

    const remindEmbed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('A Friendly Reminder')
      .setDescription(`Your remind timer is now up. Time for you to do: **${desc}**`);

    await interaction.reply({ embeds: [embed] });

    setTimeout(async () => {
      if (channel) {
        // If the channel is valid, send the reminder there
        await channel.send({ content: `<@${interaction.user.id}>`, embeds: [remindEmbed] });
      } else {
        // Fallback to sending a DM to the user
        const user = await interaction.user.fetch(); // Directly use interaction.user
        user.send({ embeds: [remindEmbed] }).catch(() => {
          console.error(`Failed to send a DM to ${interaction.user.username}`);
        });
      }
    }, time * 1000); // Convert time to milliseconds
  },
};
