'use strict';
const Telegraf = require('telegraf');
const express = require('express');
const request = require('request');

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

var url = 'https://api.github.com/repos/xeonax/ANXCamera10/releases';

bot.hears('stats', (ctx) => {
    return request.get({
        url: url,
        json: true,
        headers: {
            'User-Agent': 'AnxBot'
        }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            // data is already parsed as JSON:
            console.log(data.length);
            data.forEach(function (release) {
                var msg = '';
                msg += "Name:" + release.name + "\r\n";
                msg += "tag_name:" + release.tag_name + "\r\n";
                release.assets.forEach(function (asset) {
                    msg += "\tAName:" + asset.name + "\r\n";
                    msg += "\tACount:" + asset.download_count + "\r\n";
                });
                ctx.reply(msg);
            });
            return;
        }
    });

});


bot.telegram.setWebhook('ht' + 'tps://anx' + 'bot.heroku' + 'app.com/sec' + 'ret-path');

const app = express();
app.use(bot.webhookCallback('/sec' + 'ret-path'));
app.listen(PORT, () => {
    console.log('Example app listening on port ' + PORT + '!');
});