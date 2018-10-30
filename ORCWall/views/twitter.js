var twit = require('twitter')

  twitter = new twit((
    consumer_key:'TBhUWxUAwvM5eVyc98IHTIpIa';
    consumer_secret:'2uWzj940TsboeA6bM53zRq4asa2t5i5gvlugOMTBh1ORJO1m6r';
    acess_token_key: '163167121-WtXJVmxKcWNAdqVXiFnzlWXYjUylIisWFWkde5Ln';
    acess_token_secret:'nphJUDOo0ozm8Grtqj6fiKIAYcowQa1VgZ2mweu47H1Sf';

  ));

var count = 0;
  util= require('util');

twitter.stream('filter',{track 'science'}, function(stream){
  stream.on('data', function(data){
      console.log(util.inspect(data));
      stream.destroy();
      process.exit(0);
  });
});
