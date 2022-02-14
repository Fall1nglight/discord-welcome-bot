const { checkPerm } = require('../utils/utils');

module.exports = {
  name: 'interactionCreate',
  once: false,

  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );

    // if the command has permissions
    if (command.clientPerms) {
      if (!checkPerm(interaction.member, command.clientPerms)) {
        return interaction.reply('You cannot use this command!');
      }
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  },
};
