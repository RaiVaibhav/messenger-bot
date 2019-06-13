process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Message = require('../models/message');
let createMessage = require('../utils/createMessage');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bot');
let should = chai.should();


chai.use(chaiHttp);

describe('Messages', () => {
	beforeEach( (done) => { //Before each test we empty the database
		Message.remove({}, async (err) => { 
       await createMessage(
        {
          "id": "1",
          "text": "something",
          "user": "2291803190935876",
          "timestamp": "1560004143881",
          "question": "Please tell me your full name."
        });
        await createMessage(
          {
            "id": "2",
            "text": "1234-12-12",
            "user": "2291803190935876",
            "timestamp": "1560004157174",
            "question": "Please tell me your birth date in YYYY-MM-DD format"
        });
       done();   
    });
	});

  describe('/GET messages', () => {
	  it('it should GET all the message', (done) => {
			chai.request(server)
		    .get('/messages')
		    .end((err, res) => {
			  	res.should.have.status(200);
			  	res.body.should.be.a('array');
			  	res.body.length.should.be.eql(2);
		      done();
		    });
	  });
  });

  describe('/GET/:messageId message', () => {
	  it('it should GET a message by the given id', (done) => {
      chai.request(server)
      .get('/messages/' + "1")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('question');
        res.body.should.have.property('text');
        res.body.should.have.property("timestamp");
        res.body.should.have.property('user');
        res.body.should.have.property('_id').eql("1");
        done();
      });
    });
	  it('it should display a message not found', (done) => {
      chai.request(server)
      .get('/messages/' + "3")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Message not found with id 3');
        done();
      });
	  });
  });

  describe('/DELETE/:messageId message', () => {
	  it('it should DELETE a message of the given id', (done) => {
      chai.request(server)
      .delete('/messages/' + "1")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Message deleted successfully!');
        done();
      });
    });
    it('it should display a message not found', (done) => {
      chai.request(server)
      .delete('/messages/' + "3")
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Message not found with id 3');
        done();
      });
    });
  });
});
