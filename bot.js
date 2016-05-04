'use strict';

const Bot = require('node-telegram-bot-api-upgrades');

const validator = require('validator');
const TinyURL = require('tinyurl');
const unshort = require('url-unshort');
const symbols = require('log-symbols');

const bot = new Bot(process.env.TOKEN, {
    polling: true
});

const prefixProtocol = url => !/^(?:f|ht)tps?\:\/\//.test(url) ? ('http://' + url) : url;

bot.onText(/^\/start$/, msg => {
    bot.sendMessage(msg.chat.id, 'Just send me a url and I\'ll shorten it!');
});

bot.onText(/^\/shorten (.+)$/, (msg, match) => {
    let url = match[1];

    if (validator.isURL(url)) {
        TinyURL.shorten(prefixProtocol(url), r => {
            bot.sendMessage(msg.from.id, r);
            console.log(symbols.success, url, '-->', r);
        });
    } else {
        bot.sendMessage(msg.chat.id, 'Sorry, that\'s not a vaid URL :(');
        console.log(symbols.error, url);
    }
});

bot.onText(/^\/shorten (.+)$/, (msg, match) => {
    let shortUrl = match[1];

    unshort.expand(shortUrl, (err, url) => {
        if (err) {
            console.log(symbols.error, err); 
        } else {
            if (url) {
                bot.sendMessage(msg.from.id, url);
                console.log(symbols.success, shortUrl, '-->', url);
            } else {
                console.log(symbols.error, shortUrl);
            }
        }
    });
});

console.log(symbols.info, 'bot server started...');
