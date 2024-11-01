require('dotenv').config({path:""}); // טוען את משתני הסביבה
const { TwitterApi } = require('twitter-api-v2');

// יצירת אינסטנס של TwitterApi עם המפתחות ממשתני הסביבה
const client = new TwitterApi({
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,

});

// פונקציה לדוגמה לפרסום ציוץ
const postTweet = async (req, res) => {
  try {
    const tweet = await client.v2.tweet('Hello Twitter from my app!');
    res.status(200).json({ message: 'Tweet posted successfully!', data: tweet });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ error: 'Failed to post tweet' });
  }
};

module.exports = { postTweet };
