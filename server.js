var fs = require('fs');
var parse = require('url').parse
var qs = require('querystring')
var http = require('http')
var spawn = require('child_process').spawn

var level = require('levelup')
var sublevel = require('level-sublevel')
var uuid = require('uuid')
var ecstatic = require('ecstatic')
var cookies = require('cookies')
var keygrip = require('keygrip')(['catpile', 'doglight'])
var WebSocketServer = require('ws').Server
var websocketStream = require('websocket-stream')
var wss = new WebSocketServer({noServer: true})

var db = sublevel(level('./data'))

var year = 1000 * 60 * 60 * 24 * 365

var opts = {
  root       : __dirname + '/public', 
  autoIndex  : true,
  defaultExt : 'html',
  baseDir: "./public"
}

var StaticPass = ecstatic(opts);

/**/

var b = spawn('watchify', ['-e', 'entry.js', '-t', 'brfs', '-o', 'public/bundle.js', '-d'])
b.stderr.on('data', function(data){ console.log(data.toString('utf8'))});

var p = RegExp('^/public/(.+)');

var server = http.createServer(function(req, res){
  
  var cookie = new cookies(req, res, keygrip)
  var sessionID = cookie.get('signed', {signed: true});
  var _db;

  if(p.exec(req.url)){
    StaticPass(req, res)
  }

  else {
    if(!(sessionID)){ // create new session

      var session = {
	id: uuid.v1(), 
	created: new Date().getTime(),
	events: {
	  server: {},
	  client: {}
	}
      }
      
      session.expires = session.created + (1000 * 60)
      _db = db.sublevel(session.id)
      _db.put('session', JSON.stringify(session))
      cookie.set('signed', session.id, {signed: true, expires: new Date(session.expires)})
//      console.log(session)
      res.writeHead(200, {"content-type" : "text/html"})
      fs.createReadStream('./public/index.html').pipe(res)
    }

    else{
      _db = db.sublevel(sessionID)
      _db.get('session', function(err, session){
	console.log(session)
	res.writeHead(200, {"content-type" : "text/html"})
	fs.createReadStream('./public/index.html').pipe(res)
      })
    }
  }

})

server.on('upgrade', function(req, socket, head){
  var cookie = new cookies(req, undefined, keygrip)
  var sessionID = cookie.get('signed', {signed: true});
  var _db, __db;
  
  if(!(sessionID)){ // no session no socket!
    console.log('NOID')
    //		socket.close()
  }
  else{
    _db = db.sublevel(sessionID)
    _db.get('session', function(err, session){
      session = JSON.parse(session);
      var q = qs.parse(parse(req.url).query);
      wss.handleUpgrade(req, socket, head, function(ws){
	var stream = websocketStream(ws)
	stream.session = session
	stream.pipe(stream)
	stream.on('data', function(data){
	})
      })
    })
  }	
})

server.listen(11010)
console.log('GOTO http://localhost:11010')
