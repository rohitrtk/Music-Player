require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8101;

app.post('/refresh', async (req, res) => {
  console.log('refresh');
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken
  });

  try {
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post('/login', async (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get('/lyrics', async (req, res) => {
  const artist = req.query.artist;
  const track = req.query.track;
  const lyrics = (await lyricsFinder(artist, track)) || 'Unable to find lyrics';

  res.json({ lyrics });
});

app.get('/authurl', (req, res) => {
  res.json({
    clientId: process.env.CLIENT_ID,
    redirectUri: process.env.REDIRECT_URI
  });
});

app.listen(port);
console.log(`Listening on port ${port}`);