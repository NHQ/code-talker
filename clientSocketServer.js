var websocket = require('websocket-stream')
var stream = websocket('ws://'+ window.location.host + window.location.pathname)

module.exports = stream

var ended = false;

stream.on('end', closer)
stream.on('close', closer)

function closer(){
  ended = true
}
