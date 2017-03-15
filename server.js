var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient();
var uri = 'mongodb://cooldude:1234@ds131480.mlab.com:31480/heroku_080807zm' || process.env.MONGOLAB_URI;

console.log(process.env)

app.set('port', process.env.PORT || 5000);

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
      if (err) throw new Error('something done goofed');
      db.create('urls');
      console.log('yeyeeyeye');
    })
});


app.listen(app.get('port'), function(){-
  console.log('URL shortener listening on port ' + app.get('port'));
});
