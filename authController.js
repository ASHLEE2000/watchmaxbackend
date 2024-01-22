
//***************** Author ASHLEY FERNANDES ********************************//
// Copyright belongs to the author
// handles create user, token and refresh token

const jwt = require('jsonwebtoken');
const { getPgVersion, sql } = require('./database')

let refreshTokens = [];

async function login(req, res){

  const userName = req.body.userName;
  const password = req.body.password;
  console.log('user name: ' + userName + ' password: ' + password);

  try {

    getPgVersion()
    const _ = await sql`INSERT INTO users(userName, password) VALUES (${userName}, ${password})`;
    const data = { userName, password };
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn : '5m' });
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET_KEY);
    const dateTimeIn7Days = getDateTimeIn7Days();
    const _2 = await sql`INSERT INTO sessions(userName, refreshToken, validTill) VALUES (${userName}, ${refreshToken}, ${dateTimeIn7Days})`;
    refreshTokens.push(refreshToken);
    res.json({ token, refreshToken });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');

  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  console.log('refresh Token:' + refreshToken);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
    if (err) {
      console.error(err.message);
      return res.sendStatus(403);
    }

    try {
      const result = await sql`SELECT validTill FROM sessions WHERE userName = ${data.userName} AND refreshToken = ${refreshToken}`;

      if (result.length === 0) {
        return res.sendStatus(401);
      }

      const expDateStr = result[0].validtill.split(',')[0];
      const [day, month, year] = expDateStr.split('/');
      const expDate = new Date(`${month}/${day}/${year}`);
      const currentDate = new Date();

      if (expDate > currentDate) {
        console.error('Refresh session expired for USERNAME:', data.userName);
        return res.sendStatus(403);
      }

      // If the refresh session is still valid, generate a new access token
      const newToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '10m' });
      res.json({ token: newToken });
    } catch (error) {
      console.error('Error getting session:', error);
      return res.sendStatus(403);
    }
  });
};


const getProtectedData = async (req, res) => {
  try {
    getPgVersion()
    const result = await sql`SELECT * FROM users;`;
    res.json({ result });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');

  }
};

function formatDateTime(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  return date.toLocaleString(undefined, options);
}

// Function to get the date and time exactly 7 days from now
function getDateTimeIn7Days() {
  const currentDate = new Date();
  const sevenDaysFromNow = new Date(currentDate);
  sevenDaysFromNow.setDate(currentDate.getDate() + 7);

  return formatDateTime(sevenDaysFromNow);
}

module.exports = {
  login,
  refreshToken,
  getProtectedData,
};
