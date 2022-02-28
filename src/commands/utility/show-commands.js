const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { CATEGORIES } = require('../../utils/utils');

module.exports = {
  config: {
    location: __filename,
    ownerOnly: true,
    dm: true,
    category: CATEGORIES.utility,
    cooldown: 3000,
  },

  data: new SlashCommandBuilder()
    .setName('show-commands')
    .setDescription('Displays the active commands'),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   * @param {import('discord.js').Client} client
   */

  async execute(interaction, client) {
    const commands = Array.from(client.commands.values());

    const commandsEmbed = new MessageEmbed().setTitle('List of commands');

    for (const command of commands) {
      commandsEmbed.addField(
        command.data.name,
        command.data.description,
        false
      );
    }

    await interaction.reply({ embeds: [commandsEmbed] });
  },
};
