require('dotenv').load();

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TBhUWxUAwvM5eVyc98IHTIpIa,
    consumer_secret: process.env.2uWzj940TsboeA6bM53zRq4asa2t5i5gvlugOMTBh1ORJO1m6r,
    bearer_token: process.env.163167121-WtXJVmxKcWNAdqVXiFnzlWXYjUylIisWFWkde5Ln
});

client.get('search/tweets', {q: '#ios #swift'}, function(error, tweets, response) {
    tweets.statuses.forEach(function(tweet) {
        console.log("tweet: " + tweet.text)
    });
});
