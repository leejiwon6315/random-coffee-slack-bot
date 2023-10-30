import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
import { executeSchedulerCoffeeBot } from './src/coffee.js';

dotenv.config();

const TOKEN = process.env.API_TOKEN;
const client = new WebClient(TOKEN);
const CHANNEL_ID = process.env.TEST_CHANNEL;

const rule = {
  hour: 10,
  minute: 0,
  dayOfWeek: 1,
};

const requestMessage = async (message) => {
  try {
    await client.chat
      .postMessage({
        channel: CHANNEL_ID,
        text: message,
      })
      .then((res) => console.log(res.message.text));
  } catch (error) {
    console.log('에러: ', error);
  }
};

const job = schedule.scheduleJob(rule, () => {
  executeSchedulerCoffeeBot(requestMessage);
});

(async () => {
  await job;

  console.log('Random-Coffee-App is running!');
})();
