var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'TBhUWxUAwvM5eVyc98IHTIpIa',
  consumer_secret: '2uWzj940TsboeA6bM53zRq4asa2t5i5gvlugOMTBh1ORJO1m6r',
  access_token_key: '163167121-WtXJVmxKcWNAdqVXiFnzlWXYjUylIisWFWkde5Ln',
  access_token_secret: 'nphJUDOo0ozm8Grtqj6fiKIAYcowQa1VgZ2mweu47H1Sf'
});

var tws='';

client.get('search/tweets', {q: 'rainbow', count: 3 }, function(error, tweets, response) {
  var tws = tweets.statuses;

  for(var i=0; i< tws.length; i++){
    console.log(tws[i].user.profile_image_url , tws[i].user.name , tws[i].source , tws[i].created_at , tws[i].text);




  }
// console.log(tweets);

}
);
