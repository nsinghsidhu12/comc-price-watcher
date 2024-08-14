# COMC Price Watcher
A Discord bot to help me buy cards by notifying me when a specific card listed on COMC is equal to or drops below a set amount I configured for that card. 

## Description
COMC Price Watcher is a Discord bot application that scrapes the prices of cards from Check Out My Cards (COMC). I can add certain cards to my watch list by inserting the card's URL from COMC and a set price I want to purchase at (or less than the set price). Each card added to the watch list can have its attributes like its price and notify status updated as well. The bot will go through each card in the watch list that it's watching (from the notify status) and compare the cheapest available card from the card's URL to the card's set price. If the cheapest available card listed on COMC at the time is less than or equal to the card's price set by me and it's been an hour since the card's last notification, the bot will notify me. I can also remove cards from the watch list at any time.

This bot is for personal use only.

## Technologies
* Node.js v20.13.1

## Examples

### Add

![](https://github.com/nsinghsidhu12/comc-price-watcher/blob/main/gifs/add.gif)

### Notify
![](https://github.com/nsinghsidhu12/comc-price-watcher/blob/main/gifs/notify.gif)

### List
![](https://github.com/nsinghsidhu12/comc-price-watcher/blob/main/gifs/list.gif)
