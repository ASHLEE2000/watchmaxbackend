
//***************** Author ASHLEY FERNANDES ********************************//

const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ extended: true, limit: '5000mb' }));
app.use(routes);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
