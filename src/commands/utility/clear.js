const { SlashCommandBuilder } = require('@discordjs/builders');
const { bold } = require('@discordjs/builders');

const { CATEGORIES } = require('../../utils/utils');

module.exports = {
  config: {
    location: __filename,
    ownerOnly: false,
    dm: false,
    category: CATEGORIES.utility,
    cooldown: 3000,
  },

  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes messages')
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of messages to delete')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('Specific user messages')
    ),

  // todo
  // use optional chaining (?)
  // when there aren't any messages
  // it fails -> fix

  async execute(interaction, client) {
    const { channelId } = interaction;
    const channel = client.channels.cache.get(channelId);
    const amount = interaction.options.getInteger('int');
    const selectedUser = interaction.options.getUser('user');

    const fetchMessages = async (limit = 100) => {
      const messages = await channel.messages.fetch({ limit });
      return messages;
    };

    const deleteMessages = async (messages) => {
      if (messages.size > 1 || messages.length > 1) {
        await channel.bulkDelete(messages);
        return;
      }

      const singleMessage = messages[0] ? messages[0] : messages.first();
      await singleMessage.delete();
    };

    const sendReply = async (messages) => {
      const numOfDeletedMessages = messages.size || messages.length;

      await interaction.reply(
        `Successfully deleted ${bold(numOfDeletedMessages)} ${
          numOfDeletedMessages > 1 ? 'messages..' : 'message..'
        }`
      );
    };

    const getUserMessages = (messages, user) => {
      const filteredMessages = messages
        .filter((msg) => msg.author.id === user.id)
        .first(amount);
      return filteredMessages;
    };

    // if selectedUser is defined, fetch 100 messages
    // otherwise fetch x amount
    const messages = selectedUser
      ? await fetchMessages()
      : await fetchMessages(amount);

    const messagesToDelete = selectedUser
      ? getUserMessages(messages, selectedUser)
      : messages;

    await deleteMessages(messagesToDelete);
    await sendReply(messagesToDelete);

    setTimeout(async () => {
      await interaction.deleteReply();
    }, 3000);
  },
};
