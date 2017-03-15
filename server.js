var express = require('express');
var ip = require('ip');
var app = express();

app.set('port', process.env.PORT || 8080);

app.get('/', function(req,res){
  res.send(JSON.stringify(obj));
});

app.listen(app.get('port'), function(){-
  console.log('URL shortener listening on port ' + app.get('port'));
});
