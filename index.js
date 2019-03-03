'use strict';
const Telegraf = require('telegraf');
const express = require('express');
const request = require('request-promise');

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

var url = 'https://api.github.com/repos/xeonax/ANXCamera10/releases';
var oldmsg = '';
bot.command('anxtagstats', (ctx) => {
    return ctx.replyWithHTML("Gettings tag stats").then(() => request({
        url: url,
        json: true,
        headers: {
            'User-Agent': 'AnxBot'
        }
    }).then((data) => {
        // data is already parsed as JSON:
        console.log(data.length);
        var msg = '';
        var totaldownloads = 0;
        data.forEach(function (release) {
            // msg += "Name:" + release.name + "\r\n";
            // msg += "tag_name:" + release.tag_name + "\r\n";
            release.assets.forEach((asset) => {
                msg += "[" + release.name + "](" + asset.browser_download_url + ") [";
                msg += asset.download_count + "]\r\n";
                totaldownloads += asset.download_count;
            });
        });
        console.log('replyWithMarkdown');
        msg += "Total Downloads:" + totaldownloads;
        msg += "\r\n/anxstats";
        return ctx.replyWithMarkdown(msg);
    }).catch((err) => {
        return ctx.reply("/anxtagstats failed");
    }));
});

bot.command('anxstats', (ctx) => {
    return ctx.replyWithHTML("Gettings stat").then(() => request({
        url: url,
        json: true,
        headers: {
            'User-Agent': 'AnxBot'
        }
    }).then((data) => {
        // data is already parsed as JSON:
        console.log(data.length);
        var msg = '';
        var totaldownloads = 0;
        data.forEach(function (release) {
            msg += release.name + ":\r\n";
            // msg += "tag_name:" + release.tag_name + "\r\n";
            release.assets.forEach(function (asset) {
                msg += "[" + asset.name + "](" + asset.browser_download_url + ") [";
                msg += asset.download_count + "]\r\n";
                totaldownloads += asset.download_count;
            });
        });
        console.log('replyWithMarkdown');
        msg += "Total Downloads:" + totaldownloads;
        msg += "\r\n/anxstats";
        return ctx.replyWithMarkdown(msg);
    }).catch((err) => {
        return ctx.reply("/anxstats failed");
    }));
});


bot.command('anxping', (ctx) => {
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
            var msg = '';
            var totaldownloads = 0;
            data.forEach(function (release) {
                msg += release.name + ":\r\n";
                // msg += "tag_name:" + release.tag_name + "\r\n";
                release.assets.forEach(function (asset) {
                    msg += "[" + asset.name + "](" + asset.browser_download_url + ") [";
                    msg += asset.download_count + "]\r\n";
                    totaldownloads += asset.download_count;
                });
            });
            console.log('replyWithMarkdown');
            msg += "Total Downloads:" + totaldownloads;
            oldmsg = msg;
            return;
        }
    });

});

bot.command('anxpong', (ctx) => ctx.replyWithMarkdown(oldmsg));
bot.command('anxpung', (ctx) => ctx.reply(oldmsg));

if (process.env.NODE_ENV == 'production') {
    bot.telegram.setWebhook('ht' + 'tps://anx' + 'bot.heroku' + 'app.com/sec' + 'ret-path');

    const app = express();
    app.use(bot.webhookCallback('/sec' + 'ret-path'));
    app.listen(PORT, () => {
        console.log('Example app listening on port ' + PORT + '!');
    });

} else {
    bot.launch();
}