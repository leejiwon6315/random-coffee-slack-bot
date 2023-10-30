import pkg from '@slack/bolt';
import dotenv from 'dotenv';

import { executeCoffeeBot } from './src/coffee.js';
import { GET_COFFEE, SUDO_OPEN, SUDO_WITH_ALIAS } from './src/message.js';

const { App } = pkg;

dotenv.config();

const app = new App({
  token: process.env.API_TOKEN,
  signingSecret: process.env.SIGN_SECRET,
  appToken: process.env.APP_TOKEN,
  port: process.env.PORT,
  socketMode: true,
});

let count = false;

app.message(SUDO_OPEN || SUDO_WITH_ALIAS, ({ _, say }) => {
  executeCoffeeBot(SUDO_OPEN, say, count);

  return;
});

app.message(GET_COFFEE, ({ _, say }) => {
  executeCoffeeBot(GET_COFFEE, say, count);

  count = true;
  return;
});

(async () => {
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();
