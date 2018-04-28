const express = require('express');
const app = express();
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request');

// Uses the ng built files from the /dist folder
app.use(express.static(__dirname + '/dist'));
app.use(cors())


var client_id = 'd556205db80d40ceae86e67253b69898'; // Your client id
var client_secret = '7a98e8d42f0944ecb2aef2d72dc53745'; // Your secret
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

var x = 0;
function postSpotify () {

}
/*request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/search?q=david%20bowie&type=track&market=US&limit=1&offset=0',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      x = body;
      console.log(body);
    });
  }
});*/

function sanitizeArtist (artist) {
  var cleanArtist = artist;
  if(cleanArtist.indexOf('Featuring') != -1){
    cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('Featuring'));
  }
  if(cleanArtist.indexOf('&') != -1){
    cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('&'));
  }
  if(cleanArtist.indexOf('+') != -1){
    cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf('+'));
  }
  if(cleanArtist.indexOf(',') != -1){
    cleanArtist = cleanArtist.substring(0,cleanArtist.indexOf(','));
  }
  cleanArtist.trim();
  return cleanArtist;
}

function sanitizeTrack (track) {
  var cleanTrack = track;
  if(cleanTrack.indexOf('/') != -1){
    cleanTrack = cleanTrack.substring(0,cleanTrack.indexOf('/'));
  }
  return cleanTrack;
}

app.get('/track/:artist/:name', (req, res, next) => {
  console.log(req.params);
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
      var sanitizedArtist = sanitizeArtist(req.params.artist);
      var sanitizedTrack = sanitizeTrack(req.params.name);
      var options = {
        url: 'https://api.spotify.com/v1/search?q='+ sanitizedArtist+' ' +sanitizedTrack+' &type=track&market=US&limit=1&offset=0',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        //console.log(body.tracks);
        //console.log(body.tracks.items[0].preview_url, body.tracks.items[0].album.images[0].url);
        if(body && body.tracks && body.tracks.items[0]){
          res.json({mp3: body.tracks.items[0].preview_url, img: body.tracks.items[0].album.images[0].url});
        }
        else{
          console.log('failure',req.params);
        }
      });

    }
    else{
      console.log('error', req.params);
      res.json({mp3: '', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/CD_disc4.png'});
    }
  });
	//res.json({response: x});
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);