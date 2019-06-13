Messenger Bot
==================
A messenger bot which take birthday in `YYYY-MM-DD` format and tell how many days left in your next birthday. It built on top of famous botkit library.

- Add `.env` with configuration

```
FB_ACCESS_TOKEN=
FB_VERIFY_TOKEN=
MONGODB_URL= 
# If using cloud database service like mLab
```

(You can get above `Token` by first creating a page and setting the `Verify Token` with all the `Subscription Field`)

Instructions to run locally
==========================

#### With Docker

Clone the repository then change the mongo url to `mongodb://mongo:27017/messenger` in `index.js` file (not needed when using cloud database service like mLab)

```bash

$ docker-compose up --build
# Server started on localhost:3000
$ npx ngrok http 3000
# In new window, needed for tunneling
```
Now copy the url from ngrok (`https`) and go the `Developer console` > `webhook` > `Edit subscription` paste the url and enter the verify token and save.

#### Without Docker

Clone the repository the change the mongo url to `mongodb://localhost:27017/messenger` in `index.js` file (not needed when using cloud database service like mLab)

```bash
$ cd messenger-bot
$ npm i
$ npm start
# Server started on localhost:3000
$ npx ngrok http 3000
# In new window needed for tunneling
```
Now copy the url from ngrok (`https`) and go the `Developer console` > `webhook` > `Edit subscription` paste the url and enter the verify token and save. 

Endpoints
=========

```
/messages - lists all messages received from users

/messages/:messageId - Get and delete single message
```

Tests
=====

Run test of above endpoints

```bash

$ npm test

```

Demo
====

- **Show how old are you in days**

- **Else a good bye message**

![record](https://user-images.githubusercontent.com/22278438/59446156-96b33200-8e1e-11e9-9ad4-14011a73f4d5.gif)


![Screenshot_2019-06-13-20-47-51-918_com facebook orca](https://user-images.githubusercontent.com/22278438/59446269-cbbf8480-8e1e-11e9-8c1c-8747368d6282.png)