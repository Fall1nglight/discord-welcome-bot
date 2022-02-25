const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
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
  // prompt user a command name
  // check if it exists in the client.commands collection
  // if not -> reply with error
  // if exists remove the file from require.cache
  // then load again
  async execute(interaction, client) {
    const commandName = interaction.options.getString('command');
    const command = client.commands.get(commandName);

    if (!command) return interaction.reply('This command is not loaded..');

    if (!command.path)
      return interaction.reply('The requested cannot be reloaded.');

    delete require.cache[command.path];

    const reloadedCommand = require(command.path);
    client.commands.set(reloadedCommand.data.name, reloadedCommand);

    await interaction.reply(`Successfully reloaded ${commandName}!`);
  },
};
