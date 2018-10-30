var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'TBhUWxUAwvM5eVyc98IHTIpIa',
  consumer_secret: '2uWzj940TsboeA6bM53zRq4asa2t5i5gvlugOMTBh1ORJO1m6r',
  access_token_key: '163167121-WtXJVmxKcWNAdqVXiFnzlWXYjUylIisWFWkde5Ln',
  access_token_secret: 'nphJUDOo0ozm8Grtqj6fiKIAYcowQa1VgZ2mweu47H1Sf'
});




  var stream = client.stream('statuses/filter', {track: 'javascript'});
  stream.on('data', function(event) {
    console.log(event && event.text);
  });

  stream.on('error', function(error) {
    throw error;
  });
