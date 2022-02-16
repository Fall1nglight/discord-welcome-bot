const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { pollEmojis } = require('../../utils/emojiCharacters');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Creates a poll')
    .addIntegerOption((option) =>
      option
        .setName('int')
        .setDescription('Number of answers')
        .setMinValue(2)
        .setMaxValue(10)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('timeout')
        .setDescription('Poll time')
        .setMinValue(15)
        .setMaxValue(300)
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply('Please write the answers in different messages');

    const numOfAnswers = interaction.options.getInteger('int');
    const pollTime = interaction.options.getInteger('timeout');
    const filter = (m) => interaction.user.id === m.author.id;

    try {
      const messages = await interaction.channel.awaitMessages({
        filter,
        time: 20000,
        max: numOfAnswers,
        errors: ['time'],
      });

      // ? mit szeretnénk
      // az üzeneteket összegyűjtjük egy collection-be
      // ebből a collectionből kell csinálnunk egy stringet, ahol
      // minden egyes kérdés egy új betűvel kezdődik abc sorrend
      // szerint

      let counter = 0;
      const answers = messages
        .map((message) => {
          counter++;
          return `${pollEmojis[counter]} - ${message.content}`;
        })
        .join('\n');

      const pollMessage = await interaction.followUp(answers);
      const currEmojis = [];

      for (let i = 1; i <= numOfAnswers; i++) {
        await pollMessage.react(`${pollEmojis[i]}`);
        currEmojis.push(pollEmojis[i]);
      }

      const reactionFilter = (reaction, user) =>
        currEmojis.includes(reaction.emoji.name);

      const collector = pollMessage.createReactionCollector({
        filter: reactionFilter,
        time: pollTime,
      });

      collector.on('end', (collected) => {
        console.log(`Collected ${collected.size} items`);
      });

      // create a message with the given answers
      // then attach a reaction collector
      // limit time
      // then colelct the reactions and send back the result of the poll
    } catch (error) {
      console.log(error);
      await interaction.followUp('You did not enter any input!');
    }
  },
};
