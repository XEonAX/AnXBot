'use strict';
const Telegraf = require('telegraf');
const express = require('express');

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on('text', ({
    replyWithHTML
}) => replyWithHTML('<b>Hello</b>'));

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


bot.telegram.setWebhook('ht' + 'tps://anx' + 'bot.heroku' + 'app.com/sec' + 'ret-path');

const app = express();
app.use(bot.webhookCallback('/sec' + 'ret-path'));
app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT + '!');
});