const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluates JavaScript code.')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('The code to evaluate')
                .setRequired(true)),
    async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      ephemeral: true,
      flags: [4096],
    });
        // Make sure only bot owner or authorized users can use this command
        const allowedUsers = ['870366927653056582', '1189666481278025860', '1053012080812359750']; // Replace with your Discord user ID
        if (!allowedUsers.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You are not allowed to use this command.', ephemeral: true });
        }

        const code = interaction.options.getString('code');
        try {
            let evaled = eval(code);

            // If the result is a Promise, resolve it before sending the response
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }

            // Convert the result to a string and limit the length
            let result = String(evaled);
            if (result.length > 2000) {
                result = result.slice(0, 2000) + '...';
            }

            // Reply with the result
            interaction.editReply({ content: `\`\`\`js\n${result}\`\`\``, ephemeral: true });
        } catch (error) {
            interaction.editReply({ content: `\`\`\`js\n${error}\`\`\``, ephemeral: true });
        }
    },
};
