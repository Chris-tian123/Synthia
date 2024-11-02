const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('api')
    .setDescription('Retrieve stats from multiple APIs')
    .addStringOption(option => 
      option.setName('category')
      .setDescription('Choose an API')
      .setRequired(true)
      .addChoices(
        { name: 'Crypto Prices', value: 'crypto' },
        { name: 'Weather', value: 'weather' },
        { name: 'Pella Open Stats', value: 'pella' },
        { name: 'Random Fact', value: 'randomFact' },
        { name: 'Dog Fact', value: 'dogFact' },
        { name: 'Random Dog Image', value: 'dogImage' },
        { name: 'Anime Quote', value: 'anime' },
        { name: 'Breaking News', value: 'news' },
        { name: 'Joke', value: 'joke' },
        { name: 'Random Quote', value: 'inspirationalQuote' },
        { name: 'Random Image', value: 'randomImage' },
        { name: 'Advice', value: 'advice' }
      )
    ),

  async execute(interaction) {

    await interaction.deferReply({
      allowedMentions: {
        repliedUser: false,
      },
      flags: [4096],
      ephemeral: true,
    });

    const apiChoice = interaction.options.getString('category');
    let apiUrl, apiResponse;

    try {
      switch (apiChoice) {
        case 'crypto':
          apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Crypto Prices:\nBitcoin: $${apiResponse.data.bitcoin.usd}\nEthereum: $${apiResponse.data.ethereum.usd}`, ephemeral: true});
          break;

        case 'weather':
          apiUrl = 'https://wttr.in/?format=%C+%t';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Current Weather: ${apiResponse.data}`, ephemeral: true});
          break;

        case 'pella':
          apiUrl = 'https://api.pella.app/stats/open';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Pella Open Stats: ${JSON.stringify(apiResponse.data)}`, ephemeral: true });
          break;

        case 'randomFact':
          apiUrl = 'https://uselessfacts.jsph.pl/random.json';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Random Fact: ${apiResponse.data.text}`, ephemeral: true});
          break;

        case 'dogFact':
          apiUrl = 'https://dog-api.kinduff.com/api/facts';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Dog Fact: ${apiResponse.data.facts[0]}`, ephemeral: true});
          break;

        case 'dogImage':
          apiUrl = 'https://dog.ceo/api/breeds/image/random';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({ content: 'Here is a random dog image!', files: [apiResponse.data.message], ephemeral: true });
          break;

        case 'anime':
          apiUrl = 'https://anime-quotes-api.vercel.app/api/random';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content:`Anime Quote: "${apiResponse.data.quote}" - ${apiResponse.data.character}`, ephemeral: true});
          break;

        case 'news':
          const newsApiKey = 'a4e420f4277a4e4ea050f932921f9979'; // Replace with your NewsAPI key
          apiUrl = `https://newsapi.org/v2/top-headlines?country=georgia&apiKey=${newsApiKey}`;
          apiResponse = await axios.get(apiUrl);
          const newsArticle = apiResponse.data.articles[0];
          if (newsArticle) {
            await interaction.editReply({content: `Breaking News: ${newsArticle.title} - ${newsArticle.description}`, ephemeral: true});
          } else {
            await interaction.editReply({content: 'No news articles found.', ephemeral: true});
          }
          break;

        case 'joke':
          apiUrl = 'https://official-joke-api.appspot.com/random_joke';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply({content: `Joke: ${apiResponse.data.setup} - ${apiResponse.data.punchline}`, ephemeral: true});
          break;

        case 'inspirationalQuote':
          apiUrl = 'https://api.quotable.io/random?tags=inspirational';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply(`"${apiResponse.data.content}" - ${apiResponse.data.author}`);
          break;

        case 'randomImage':
          apiUrl = 'https://source.unsplash.com/random/800x600';
          await interaction.reply({ content: 'Here is a random image!', files: [apiUrl] });
          break;

        case 'advice':
          apiUrl = 'https://api.adviceslip.com/advice';
          apiResponse = await axios.get(apiUrl);
          await interaction.editReply(`Advice: "${apiResponse.data.slip.advice}"`);
          break;

        default:
          await interaction.editReply('Unknown category selected.');
          break;
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('An error occurred while fetching data.');
    }
  },
};
