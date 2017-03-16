//declarations
var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;
var port = process.env.PORT || 5000;
var uri = process.env.MONGOLAB_URI || 'mongodb://cooldude:1234@ds131480.mlab.com:31480/heroku_080807zm'; //process.env.MONGOLAB_URI is for Heroku
var regex = new RegExp("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})"); // matches viable URL strings

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

//routes
app.get('/', function(req,res){
  res.render('index');
});

app.get('/:num', function(req,res){
  var num = req.params.num;
  if (num == 'new') res.json({'error' : 'Add a URL after /new/'});
  else {
    mongo.connect(uri, function(err,db){
      if (err) throw new Error('something done goofed whilst connecting');
      var collection = db.collection('urls');

      // var query = function(db, callback) {

        collection.findOne({ short_url : 'https://kraxx-url-shortener.herokuapp.com/' + num },
          { long_url: 1, _id: 0 },
          function(err,found) {
          if (err) throw new Error('something done goofed whilst finding');
          if (found === null) {
            res.json({'error' : 'Provided number not found in database'});
          }
          else {
            console.log('found data should NOT be null: ', found);
            if (found.long_url.charAt(0) == 'w') {
              console.log('redirecting...');
              res.redirect(301, 'http://' + found.long_url);
            }
            else {
              console.log('redirecting...');
              res.redirect(301, found.long_url);
            }
          }
        });

      // }

      // query(db, function() {
      //    db.close();
      // })

    })
  }
});

app.get('/new/:url(*)', function(req,res){
  var url = req.params.url;
  if (regex.test(url)){
    mongo.connect(uri, function(err,db){
      console.log(uri);
      if (err) throw new Error('something done goofed whilst connecting');
      else {

        // var query = function(db,callback) {

          var collection = db.collection('urls');
          collection.findOne({ long_url : url },
          { long_url: 1, short_url: 1, _id: 0 },
           function(err,found) {
            if (err) throw new Error('something done goofed whilst finding')
            if (found === null) {
              collection.count().then(function(num){
                var newEntry = {
                   long_url: url,
                   short_url: "https://kraxx-url-shortener.herokuapp.com/" + (num + 1)
                };
              collection.insert(newEntry);
              res.json({
                   long_url: url,
                   short_url: "https://kraxx-url-shortener.herokuapp.com/" + (num + 1)
                });
              });
            }
            else {
              res.json(found);
            }
          })

      // }

      // query(db,function() {
      //   db.close();
      // })

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
