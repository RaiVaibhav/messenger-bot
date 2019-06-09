const Message = require('../models/message.js');

exports.create = (req, res) => {
  if(!req.body.content) {
      return res.status(400).send({
          message: "Message content can not be empty"
      });
  }

  const message = new Message({
      _id: req.body.id, 
      text: req.body.text,
      user: req.body.user,
      timestamp: req.body.timestamp
  });

  message.save()
  .then(data => {
      res.send(data);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the Message."
      });
  });
};


exports.findAll = (req, res) => {
  Message.find()
  .then(messages => {
      res.send(messages);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving notes."
      });
  });
};

exports.findOne = (req, res) => {
  Message.findById(req.params.messageId)
  .then(message => {
      if(!message) {
          return res.status(404).send({
              message: "Message not found with id " + req.params.messageId
          });            
      }
      res.send(message);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "Message not found with id " + req.params.messageId
          });                
      }
      return res.status(500).send({
          message: "Error retrieving MessageId with id " + req.params.messageId
      });
  });
};

exports.delete = (req, res) => {
  Message.findByIdAndRemove(req.params.messageId)
  .then(message => {
      if(!message) {
          return res.status(404).send({
              message: "Message not found with id " + req.params.messageId
          });
      }
      res.send({message: "Message deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "Message not found with id " + req.params.messageId
          });                
      }
      return res.status(500).send({
          message: "Could not delete Message with id " + req.params.messageId
      });
  });
};