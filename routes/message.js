module.exports = (app) => {
  const message = require('../controllers/message.js');

  app.post('/messages', message.create);

  app.get('/messages', message.findAll);

  app.get('/messages/:messageId', message.findOne);

  app.delete('/messages/:messageId', message.delete);
}