const axios = require('axios');
const CryptoJS = require('crypto-js');
const qs = require('qs');
const moment = require('moment');

class ZaloPayIntegration {
  constructor(config) {
    this.app_id = config.app_id;
    this.key1 = config.key1;
    this.key2 = config.key2;
    this.endpoint_create = config.endpoint_create;
    this.endpoint_query = config.endpoint_query;
    this.callback_url = config.callback_url;
  }

  async createOrder(items, app_user, amount) {
    const embed_data = {
      redirecturl: 'https://www.facebook.com/profile.php?id=61551457947466',
    };

    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: this.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      callback_url: this.callback_url,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: '',
    };

    const data =
      order.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;

    order.mac = CryptoJS.HmacSHA256(data, this.key1).toString();

    try {
      const result = await axios.post(this.endpoint_create, null, { params: order });
      return result.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async handleCallback(req) {
    const { app_trans_id, mac } = req.body;

    try {
      if (!this.verifyCallback(app_trans_id, mac, this.key2)) {
        throw new Error('Invalid MAC');
      }

      const postData = {
        app_id: this.app_id,
        app_trans_id,
        mac: CryptoJS.HmacSHA256(`${this.app_id}|${app_trans_id}`, this.key2).toString(),
      };

      const postConfig = {
        method: 'post',
        url: this.endpoint_query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
      };

      const response = await axios(postConfig);
      return response.data;
    } catch (error) {
      console.error('Error handling ZaloPay callback:', error);
      throw error;
    }
  }

  verifyCallback(app_trans_id, mac, key) {
    const data = `${this.app_id}|${app_trans_id}`;
    const calculatedMac = CryptoJS.HmacSHA256(data, key).toString();
    return mac === calculatedMac;
  }
}

// Example usage:
const config = {
  app_id: 'your_app_id',
  key1: 'your_key1',
  key2: 'your_key2',
  endpoint_create: 'https://sb-openapi.zalopay.vn/v2/create',
  endpoint_query: 'https://sb-openapi.zalopay.vn/v2/query',
  callback_url: 'https://your-callback-url.com/callback',
};

const zalopayIntegration = new ZaloPayIntegration(config);

// Example: Creating an order
const items = []; // Replace with actual items array
const app_user = 'user123'; // Replace with actual user
const amount = 50000; // Replace with actual amount

zalopayIntegration.createOrder(items, app_user, amount)
  .then(result => console.log('Order created:', result))
  .catch(error => console.error('Error creating order:', error));

// Example: Handling callback from ZaloPay (Express route)
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/callback', async (req, res) => {
  try {
    const result = await zalopayIntegration.handleCallback(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = ZaloPayIntegration;
