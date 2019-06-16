require('dotenv').config()
let getDays = require('./utils/util');
let createMessage = require('./utils/createMessage');
var botkit = require('botkit');
let winston = require('winston');
var facebookController = botkit.facebookbot({
  verify_token: process.env.FB_VERIFY_TOKEN,
  access_token: process.env.FB_ACCESS_TOKEN,
  logger: new winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './bot.log' })
    ]
  })
});

var webserver = require('./index.js')(facebookController);
// facebookController.api.messenger_profile.greeting("Welcome to the Test bot");
// facebookController.api.messenger_profile.get_started("Get Started");

facebookController.hears(['.*'],['message_received','facebook_postback'],
  async function(bot, message) {
    if (message.type==="message_received"){
      await createMessage(
        {id:message.mid, user: message.user, text: message.text,
          timestamp: message.timestamp});
    }
    bot.startConversation(message, function(err, convo) {
      
      convo.say('Hey');
      convo.ask('Please tell me your full name.', async function(response, convo) {
        await createMessage(
          {id:response.mid, user: response.user, text: response.text,
            timestamp: response.timestamp, question:response.question});
        askDOB(response, convo);
        convo.next();
      });

      let askDOB = function(response, convo){
        convo.say(`Hi ${response.text} ! nice to meet you`);
        convo.ask('Please tell me your birth date in YYYY-MM-DD format',
          async function(response, convo){
            await createMessage(
              {id:response.mid, user: response.user, text: response.text,
                timestamp: response.timestamp, question: response.question});
            let days = getDays(response.text);
            if (days){
              askDisplayOld(days, response, convo);
            }else{
              bot.reply(response, `Those dates don't seem right`);
              convo.repeat();
            }
            convo.next();
          }
        );
      };
      let askDisplayOld = function(days,response, convo){
        let question = "You want to know how old are you in days?";
        convo.ask({
          attachment: {
              'type': 'template',
              'payload': {
                  'template_type': 'button',
                  'text': `${question}`,
                  'buttons': [
                      {
                          'type': 'postback',
                          'title': 'Yes',
                          'payload' : 'SAID_YES'
                      },
                      {
                          'type': 'postback',
                          'title': 'No',
                          'payload' : 'SAID_NO'
                      }

                  ]
              }
          }
      },async function (response, convo) {
          console.log('response', response)
          if (response.payload==="SAID_NO" && response.type==="facebook_postback"){
            await createMessage(
              {id:(""+response.timestamp), user: response.user, text: response.text,
                timestamp: response.timestamp, question: question});
            convo.say("Good Bye 👋");
          }
          if (response.payload==="SAID_YES" && response.type==="facebook_postback"){
            await createMessage(
              {id:(""+response.timestamp), user: response.user, text: response.text,
                timestamp: response.timestamp, question: question});
            convo.say(`There are ${days} days left until your next birthday`)
          }
          if (response.type==="message_received"){
            if (bot.utterances.yes.test(response.text)){
              await createMessage(
                {id:response.mid, user: response.user, text: response.text,
                  timestamp: response.timestamp, question: response.question});
              convo.say(`There are ${days} days left until your next birthday`)
            }else if(bot.utterances.no.test(response.text)){
              await createMessage(
                {id:response.mid, user: response.user, text: response.text,
                  timestamp: response.timestamp, question: response.question});
              convo.say("Good Bye 👋");
            }else{
              bot.reply(response, `Sorry couldn't understand`);
              convo.repeat();
            }
          }
          convo.next();
        })
      };
    });
  }
);

module.exports = webserver;