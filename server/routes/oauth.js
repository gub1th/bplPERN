const router = require("express").Router()
const pool = require("../db")
const jwtGenerator = require("../utils/jwtGenerator")
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Redirects user to Google's OAuth 2.0 server
router.get('/google/redirect', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    response_type: 'code',
    scope: ['profile', 'email'],
  });
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: CLIENT_ID
      });

      const payload = ticket.getPayload()

      const googleId = payload['sub'];
      const email = payload['email'];
      const firstName = payload['given_name'];
      const lastName = payload['family_name'];
      const pictureUrl = payload['picture'];

      // check if the user exists
      const user = await pool.query("SELECT * from users WHERE google_id = $1", [googleId])
      
      if (user.rows.length !== 0) {
          const token = jwtGenerator(user.rows[0].user_id)
          res.redirect(`http://localhost:3000/login?token=${token}`);
          return
      }

      //create a new user and profile
      const newUser = await pool.query("INSERT INTO users (google_id, email) VALUES ($1, $2) RETURNING *",
          [googleId, email])

      // create a profile for the new user
      const profile = await pool.query("INSERT INTO profiles (user_id, first_name, last_name, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
          [newUser.rows[0].user_id, firstName, lastName, pictureUrl])

      //generate our jwt token
      const token = jwtGenerator(newUser.rows[0].user_id)

      res.redirect(`http://localhost:3000/login?token=${token}`);
    } catch (error) {
      res.status(500).send('Authentication failed :(');
    }
  });

module.exports = router;