const Message = require('../models/message.js');

let createMessage = function(data){
  const message = new Message({
    _id: data.id, 
    text: data.text,
    user: data.user,
    timestamp: data.timestamp,
    question: data.question
  });

  message.save()
  .then(data => {
    console.log("Data saved sucessfully");      
  }).catch(err => {
      // Some error occured
    console.log(err.message);
  });
}
module.exports = createMessage