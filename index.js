require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require("fs")
var path = require("path");
var morgan = require("morgan");

module.exports = function(controller) {

    var webserver = express();
    if (process.env.NODE_ENV!=="test"){
      var accessLogStream = fs.createWriteStream(
        path.join(__dirname, "server.log"),
        { flags: "a" }
      );
      webserver.use(morgan("combined", { stream: accessLogStream }));
    }
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));
    webserver.use(express.static('public'));
    if (process.env.NODE_ENV==="test"){
      webserver.set('mongo_url', `mongodb://127.0.0.1:27017/test-db`);
    }else{
      webserver.set('mongo_url', (process.env.MONGODB_URL || `mongodb://127.0.0.1:27017/messenger`));
    }
    mongoose.connect(webserver.get('mongo_url'),{ useNewUrlParser: true },function(err){
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log("connected to " + webserver.get('mongo_url'));
    });
    require('./routes/message.js')(webserver);

    webserver.listen(process.env.PORT || 3000,  null, function() {
        console.log('Express webserver configured and listening!')
    });
    require('./incoming-webhook')(webserver, controller)
    
    controller.webserver = webserver;

    return webserver;

}

