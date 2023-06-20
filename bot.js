// // // Copyright (c) Microsoft Corporation. All rights reserved.
// // // Licensed under the MIT License.


const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');

class NewsBot extends ActivityHandler {
    constructor() {
        super();

        // Welcome message
        this.onMembersAdded(async(context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome to our news bot! You can ask me "What\'s in the news today?" to get the top news articles.🤔';

            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }

            await next();
        });

        // Fetch news articles
        async function getTopHeadlines() {
            try {
                const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=5b2440e35c4f44b6a0eca0d9363e6d67
                `);
                const articles = response.data.articles;
                return articles;
            } catch (error) {
                console.error(error);
            }
        }

        async function handleMessage(context) {
            const message = context.activity.text.toLowerCase();

            if (message.includes('what is in the news today')) {
                const articles = await getTopHeadlines();
                let response = 'Here are the top news articles for today: \n\n';
                articles.forEach((article, index) => {
                    response += `${index + 1}. ${article.title}\n${article.description}\n${article.url}\n\n`;
                });
                await context.sendActivity(MessageFactory.text(response, response));
            } else {
                const replyText = `Sorry, I didn't understand that. You can ask me "What's in the news today?" to get the top news articles.`;
                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
        }

        this.onMessage(async(context, next) => {
            await handleMessage(context);
            await next();
        });
    }
}

module.exports.NewsBot = NewsBot;