const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.interactionCreate,
  once: false,

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command = client.commands.get(commandName);

    if (!command)
      return interaction.reply(
        'This command cannot be executed at the moment...\nPlease try again later!'
      );

    if (
      command.config.ownerOnly &&
      interaction.user.id !== interaction.guild?.ownerId
    )
      return interaction.reply(
        'This command can be only executed by the Owner of the server!'
      );

    if (command.config.dm === false && interaction.guild === null)
      return interaction.reply('This command cannot be executed in DMs!');

    const currTime = new Date().getTime();
    const commandCooldowns = client.cooldowns.get(commandName);
    const clientCooldown = commandCooldowns.get(interaction.member.id);

    if (clientCooldown && clientCooldown.expiresAt > currTime)
      return interaction.reply(
        `You have to wait ${
          (clientCooldown.expiresAt - currTime) / 1000
        } second(s) before executing this command!`
      );

    commandCooldowns.set(interaction.member.id, {
      executedAt: currTime,
      expiresAt: currTime + command.config.cooldown,
    });

    client.cooldowns.set(commandName, commandCooldowns);

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
