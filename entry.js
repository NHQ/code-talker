var diff = require('diff');

var editor = require('./')();
var ws = require('./clientSocketServer')

var ed = editor.editor.editor;
ed.scrollTo(0,0)
//ed.setSize('40%', '50%')
var ed2 = editor.editor2.editor
var val = ed.getValue();
var val2 = ed2.getValue();

ed.on('change', function(from, to, txt){
  var n = ed.getValue();
  var d  = diff.createPatch('code-talker', val, n)
  var x = val;
  val = n
  ws.write(d)
})

ws.on('data', function(d){
  var n = ed2.getValue();
  var x = val2;
  console.log(n, diff.applyPatch(n, d))
  ed2.setValue(diff.applyPatch(n, d))
})
