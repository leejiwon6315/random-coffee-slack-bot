import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
// import { executeTmpCoffeeBot } from './tmp.js';
// import { executeCoffeeBot } from './coffee.js';
// import { GET_COFFEE } from './src/message.js';

dotenv.config();

const TOKEN = process.env.API_TOKEN;
const client = new WebClient(TOKEN);
const CHANNEL_ID = process.env.TEST_CHANNEL;
const rule = {
  hour: 16,
  minute: 16,
  dayOfWeek: 1,
};

const job = schedule.scheduleJob(rule, () => {
  requestMessage('스케쥴러 테스트');
});

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
  await job;
})();
