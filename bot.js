import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import { executeTmpCoffeeBot } from './tmp.js';
// import { executeCoffeeBot } from './coffee.js';
import { GET_COFFEE } from './message.js';

dotenv.config();

const TOKEN = process.env.API_TOKEN;
const client = new WebClient(TOKEN);
// const CHANNEL_ID = '';

let count = false;

const requestMessage = async (message) => {
  try {
    await client.chat
      .postMessage({
        channel: CHANNEL_ID,
        text: message,
      })
      .then((res) => console.log(res));
  } catch (error) {
    console.log('에러: ', error);
  }
};

(async () => {
  await executeTmpCoffeeBot(GET_COFFEE, requestMessage, count);

  count = true;
})();
