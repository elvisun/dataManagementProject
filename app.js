
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// connect to mysql
// username: databaseuser



// password: databasepassword
var connection = mysql.createConnection({
  host     : 'databaseforproject.cjffpyni9e6r.us-east-2.rds.amazonaws.com',
  user     : 'databaseuser',
  password : 'databasepassword',
  database : 'sys'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});


var router = express.Router();

//rendering pages
app.get('/', function (req, res) {
  res.sendFile( __dirname + '/views/index.html');
});
app.get('/calendar', function(req,res){
  res.sendFile( __dirname + '/views/cal.html');
});
app.get('/questions', function(req,res){
  res.sendFile( __dirname + '/views/questions.html');
});
app.get('/histogram', function(req,res){
  res.sendFile( __dirname + '/views/histogram.html');
});


// APIs
app.get('/citydata', function (req,res){
  connection.query('select startLocation, endLocation from offer', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.json(results);
  });
});

app.get('/calendardata', function(req,res){
  connection.query('select dateTime, COUNT(*) as _count from offer group by dateTime having COUNT(*) > 1', function (error, results, fields) {
    if (error) throw error;
    for (var i = results.length - 1; i >= 0; i--) {
      results[i].dateTime = new Date(Date.parse(results[i].dateTime));
    }
    res.json(results);
  });
});

app.get('/histogramdata', function(req,res){
  connection.query(' SELECT a.id, (count(b.fromUser) + count(c.user)) useCount FROM user a  JOIN offer b   ON a.id = b.fromUser  JOIN request c  ON a.id = c.user  group by a.id  order by a.id;',
   function (error, results, fields) {
    if (error) throw error;
    var ret = [];
    for (var i = results.length - 1; i >= 0; i--) {
      ret.splice(0,0,results[i].useCount);
    }
    var newRet = [];
    var step = 50;
    for (var i = 0; i < 30; i++){
      newRet.splice(newRet.length - 1,0,{
        Letter: i * step,
        Freq: 0
      });
    }
    for (var i = ret.length - 1; i >= 0; i--) {
      var k = Math.floor(ret[i] / step);
      //console.log(k);
      newRet[k].Freq++;
    }
    
    //console.log(newRet);
    res.json(newRet);
  });
});


module.exports = app;



