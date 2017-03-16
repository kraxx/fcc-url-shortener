var app = require('express')();
var mongo = require('mongodb').MongoClient;
var port = process.env.PORT || 5000;
var uri = process.env.MONGOLAB_URI || 'mongodb://cooldude:1234@ds131480.mlab.com:31480/heroku_080807zm'; //process.env.MONGOLAB_URI is for Heroku
var regex = new RegExp("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"); // matches viable URL strings. Taken from @diegoperini

app.get('/', function(req,res){
  res.send('Hey ho welcome to the index-o');
});

app.get('/new', function(req,res){
  console.log('connected to /new/');
  res.send('Add a URL after /new/');
});

app.get('/:num', function(req,res){
  var num = req.params.num;
  mongo.connect(uri, function(err,db){
    if (err) throw new Error('something done goofed whilst connecting');
    var collection = db.collection('urls');
    collection.findOne({ short_url : 'https://kraxx-url-shortener.herokuapp.com/' + num }, function(err,found) {
      if (err) throw new Error('something done goofed whilst finding');
      if (found === null) {
        res.json({'error' : 'Provided number not found in database'});
      }
      else {
        if (found.long_url.charAt(0) == 'w') {
           res.redirect(301, 'http://' + found.original_url);
        }
        else {
           res.redirect(301, found.original_url);
        }
      }
    })
  })
});


app.get('/new/:url(*)', function(req,res){
  var url = req.params.url;
  if (regex.test(url)){
    mongo.connect(uri, function(err,db){
      if (err) {
        throw new Error('something done goofed whilst connecting');
      }
      else {
        var collection = db.collection('urls');
        collection.findOne({ long_url : url }, function(err,found) {
          if (err) {
            throw new Error('something done goofed whilst finding')
          }
          if (found === null) {
            collection.count().then(function(num){
              var newEntry = {
                 long_url: url,
                 short_url: "https://kraxx-url-shortener.herokuapp.com/" + (num + 1)
              };
            collection.insert(newEntry);
            res.json(newEntry);
            });
          }
          else {
            res.json(found);
          }
        })
        console.log(uri);
      }
    });
  }
  else {
    res.json({'error':'Not a valid URL string, please try again'});
  }
});



app.listen(port, function(){
  console.log('URL shortener listening on port ' + port);
});
