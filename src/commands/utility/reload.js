const { SlashCommandBuilder } = require('@discordjs/builders');

const { CATEGORIES } = require('../../utils/utils');

module.exports = {
  config: {
    location: __filename,
    ownerOnly: true,
    dm: false,
    category: CATEGORIES.utility,
    cooldown: 3000,
  },

  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads given command')
    .addStringOption((option) =>
      option.setName('command').setDescription('Command name').setRequired(true)
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const commandName = interaction.options.getString('command');
    const command = client.commands.get(commandName);

    if (!command) return interaction.reply('This command is not loaded..');

    if (!command.config.location)
      return interaction.reply('The requested command cannot be reloaded.');

    delete require.cache[command.config.location];

    const reloadedCommand = require(command.config.location);
    client.commands.set(reloadedCommand.data.name, reloadedCommand);

    await interaction.reply(`Successfully reloaded ${commandName}!`);
  },
};
