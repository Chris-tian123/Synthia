const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
  data: {
    ...new SlashCommandBuilder()
      .setName("osinfo")
      .setDescription("Get information about the server's operating system"),
    integration_types: [1],
    contexts: [0, 1, 2],
  },
  async execute(interaction) {
    try {
      // Defer the reply to allow time for processing
      await interaction.deferReply({
        allowedMentions: {
          repliedUser: false,
        },
      ephemeral: true,
        flags: [4096],
      });

      // Fetch OS information using the 'os' module
      const platform = os.platform();
      const architecture = os.arch();
      const uptime = os.uptime();
      const freemem = os.freemem();
      const totalmem = os.totalmem();
      const cpus = os.cpus().length;

      // Format OS uptime
      const uptimeInHours = Math.floor(uptime / 3600);
      const uptimeInMinutes = Math.floor((uptime % 3600) / 60);
      const uptimeInSeconds = uptime % 60;

      // Construct the OS information message
      const osInfoMessage = `
      **Platform**: ${platform}
      **Architecture**: ${architecture}
      **Uptime**: ${uptimeInHours}h ${uptimeInMinutes}m ${uptimeInSeconds}s
      **Free Memory**: ${(freemem / (1024 ** 3)).toFixed(2)} GB
      **Total Memory**: ${(totalmem / (1024 ** 3)).toFixed(2)} GB
      **CPU Cores**: ${cpus}
      `;

      // Send the OS information message as a reply
      await interaction.editReply({
        content: osInfoMessage,
      ephemeral: true,
      });
    } catch (error) {
      console.error("Error fetching OS info:", error);
      await interaction.editReply({
        content: 'Sorry, there was an issue fetching the OS information.',
      ephemeral: true,
      });
    }
  },
};
