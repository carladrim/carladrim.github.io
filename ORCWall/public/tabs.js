var redditButton = document.getElementById("reddittab");
var twitterButton = document.getElementById("twittertab");

var twitterContainer = document.getElementById("tweetscontainer");
var redditContainer = document.getElementById("redditcontainer");

redditButton.addEventListener('click', function(){
    twitterContainer.style.display="none";
    redditContainer.style.display="flex";
});

twitterButton.addEventListener('click', function(){
    redditContainer.style.display="none";
    twitterContainer.style.display="flex";
});


