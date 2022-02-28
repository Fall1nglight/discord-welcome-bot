const { MessageEmbed } = require('discord.js');
const { bold } = require('@discordjs/builders');

const { EVENTS } = require('../utils/utils');

module.exports = {
  name: EVENTS.guildMemberAdd,
  once: false,

  async execute(member, client) {
    const {
      user,
      guild: { name: guildName },
    } = member;

    const channel = client.channels.cache.get('939463772765032459');
    const avatarUrl = user.avatarURL();

    const welcomeEmbed = new MessageEmbed()
      .setDescription(`🎉 Welcome to ${bold(guildName)}, ${user}!`)
      .setImage(avatarUrl);

    channel.send({ embeds: [welcomeEmbed] });
  },
};
