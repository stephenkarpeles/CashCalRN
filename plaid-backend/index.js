const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PLAID_CLIENT_ID = '6837ede11755ee0025362618';
const PLAID_SECRET = '80e2e2d86d7b2e8f33b98ab3913ba5';
const PLAID_ENV = 'sandbox';

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

let userAccessTokens = {}; // For demo only! Use a DB in production.

app.post('/api/exchange_public_token', async (req, res) => {
  const { public_token, uid } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    userAccessTokens[uid] = response.data.access_token;
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/get_accounts', async (req, res) => {
  const { uid } = req.body;
  const access_token = userAccessTokens[uid];
  if (!access_token) return res.status(400).json({ error: 'No access token for user' });
  try {
    const response = await plaidClient.accountsGet({ access_token });
    res.json(response.data.accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/get_transactions', async (req, res) => {
  const { uid, start_date, end_date } = req.body;
  const access_token = userAccessTokens[uid];
  if (!access_token) return res.status(400).json({ error: 'No access token for user' });
  try {
    const response = await plaidClient.transactionsGet({
      access_token,
      start_date: start_date || '2023-01-01',
      end_date: end_date || new Date().toISOString().slice(0, 10),
      options: { count: 100, offset: 0 }
    });
    res.json(response.data.transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Plaid backend running on port ${PORT}`)); 