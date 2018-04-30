const express = require('express');
const app = express();
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request');
const firebase = require('firebase')

var config = {
  apiKey: "AIzaSyDSRaDpwgpKA6QPsGLlpi4jc5F0t2Cglz0",
  authDomain: "sonquest-3379c.firebaseapp.com",
  databaseURL: "https://sonquest-3379c.firebaseio.com",
  projectId: "sonquest-3379c",
  storageBucket: "sonquest-3379c.appspot.com",
  messagingSenderId: "228676657274"
};

var db = firebase.initializeApp(config).database();
//var storageRef = firebase.storage().ref();
var userRef = db.ref('users');


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

function postSpotify() {

}


app.get('/track/:artist/:name', (req, res, next) => {
  console.log('track request', req.params);
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/search?q=' + req.params.artist + ' ' + req.params.name + ' &type=track&market=US&limit=1&offset=0',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function (error, response, body) {
        //console.log(body.tracks);
        //console.log(body.tracks.items[0].preview_url, body.tracks.items[0].album.images[0].url);
        try {
          res.json({
            mp3: body.tracks.items[0].preview_url,
            img: body.tracks.items[0].album.images[0].url
          });
        } catch (e) {
          console.log(e, req.params);
          res.json({
            mp3: '',
            img: ''
          })
        }
      });
    } else {
      console.log('error', req.params);
      res.json({
        mp3: '',
        img: ''
      })
    }
  });
  //res.json({response: x});
});

app.get('/user/:username', (req, res, next) => {
  var userProfile = {};
  console.log('user request', req.params);
  userRef.once('value')
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        if (req.params.username == childSnapshot.key) {
          console.log('found user', childSnapshot.key);
          var userData = childSnapshot.val();
          userProfile.name = userData.firstname + ' ' + userData.lastname;
          userProfile.playlists = [];
          var uPlaylists = userData.playlists;
          if (uPlaylists) {
            uPlaylists.forEach(function (elem) {
              var tempList = {}
              tempList.playlist_name = elem.name
              tempList.songs = [];
              if (elem.songs) {
                elem.songs.forEach(function (song) {
                  tempList.songs.push({
                    'track': song.track,
                    'artist': song.artist
                  })
                });
              }
              userProfile.playlists.push(tempList);
            });
          }
          console.log(userProfile);
          res.json(userProfile);
        } else {
          res.json({
            response: '400004 not found'
          });
        }
      })
    })
});

app.get('/admindump', (req, res, next) => {
  userRef.once('value')
    .then(function (snapshot) {
      var noPasswords = [];
      snapshot.forEach(function (childSnapshot) {
        var user = childSnapshot.val();
        user.password = '';
        noPasswords.push(user);
      });
      res.json(noPasswords);
    });
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);
