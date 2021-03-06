const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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
    .setName('welcome-message')
    .setDescription('Setup welcome message(s)')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('status')
        .setDescription('Enable or disable welcome message(s)')
        .addBooleanOption((option) =>
          option.setName('enabled').setDescription('true or false')
        )
    )
    .addSubcommandGroup((subcmdgroup) =>
      subcmdgroup
        .setName('messages')
        .setDescription('Edit, delete or add welcome message(s)')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('show')
            .setDescription('Show current welcome message(s)')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('edit')
            .setDescription('Edit welcome message')
            .addIntegerOption((option) =>
              option
                .setName('id')
                .setDescription('Enter message id')
                .setMinValue(0)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add welcome message(s)')
            .addStringOption((option) =>
              option
                .setName('message')
                .setDescription('Add a welcome message')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('delete')
            .setDescription('Delete welcome message(s)')
            .addIntegerOption((option) =>
              option
                .setName('id')
                .setDescription('Enter message id(s)')
                .setRequired(true)
            )
        )
    ),

  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */

  async execute(interaction, client) {
    const subCmd = interaction.options.getSubcommand();
    console.log(subCmd);

    // default message is the first element of the array
    try {
      switch (subCmd) {
        case 'show': {
          // Shows current welcome message(s)

          // terv
          // ? mit szeretn??nk csin??lni
          // amikor hozz??adunk egy szervert az adatb??zishoz
          // be??ll??tjuk az alap ??dv??zl?? ??zenetet
          // ? k??rd??s
          // t??mb vagy objektum legyen

          // objektum
          // content, active
          // ! id nem kell mert [{}, {}, {}]

          // t??mb
          // ??zenetek, id a t??mbben l??v?? elem helye (pl. forEach -> index)
          // m??gegy t??mb
          // active Ids

          // ? m??veletek
          // 1. megjelen??teni az ??zeneteket id-val egy??tt ??s azt is, hogy
          // akt??v-e vagy nem

          // 2. hozz??adni ??zeneteket (t??bbet is ak??r, ','-vel elv??lasztva)

          // 3. t??r??lni ??zeneteket id alapj??n (t??bbet is...)

          // 4. szerkeszteni ??zeneteket
          // tartalmat fixen, aktivit??st ?

          const query = { id: interaction.guildId };
          const options = { projection: { _id: 0, settings: 1 } };

          const guild = await client.dbGuilds.findOne(query, options);

          const {
            settings: { welcomeMessages },
          } = guild;

          const test = new MessageEmbed().setTitle('List of welcome messages');

          welcomeMessages.forEach((msg, i) => {
            test.addField(`Id - ${i}`, msg, false);
          });

          return interaction.reply({ embeds: [test] });
        }

        case 'edit': {
          //
          break;
        }

        case 'add': {
          //
          break;
        }

        case 'delete': {
          //
          break;
        }

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  },
};
