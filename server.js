var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient();
var uri = process.env.MONGOLAB_URI || 'mongodb://cooldude:1234@ds131480.mlab.com:31480/heroku_080807zm';

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
      if (err) {
        throw new Error('something done goofed');
        res.send('something bad');
      }
      else {
        // db.create('urls');
        console.log(req.params.url);
        console.log('yeyeeyeye');
        res.send('somthing GOOD');
        db.close();
      }
    });
  });



app.listen(app.get('port'), function(){
  console.log('URL shortener listening on port ' + app.get('port'));
});
