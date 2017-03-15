var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient();
var uri = 'mongodb://cooldude:1234@ds131480.mlab.com:31480/heroku_080807zm';

app.set('port', process.env.PORT || 8080);

app.get('/', function(req,res){
  res.send('Hey ho welcome to the index-o');
});

app.get('/new', function(req,res){
  console.log('connected to /new/');
  res.send('Add a url after /new/');
});

app.get('/:url', function(req,res){

});


app.get('/new/:url', function(req,res){
  console.log('connecting to mongo');
    mongo.connect(uri, function(err,db){
      if (err) throw err;
      res.send('its working!');
      console.log('yeyeeyeye');
    })


});


app.listen(app.get('port'), function(){-
  console.log('URL shortener listening on port ' + app.get('port'));
});
