var diff = require('diff');
var adiff = require('adiff');

var editor = require('./')();
var ws = require('./clientSocketServer')
var secondary = false;
var ed = editor.editor.editor;
ed.scrollTo(0,0)
//ed.setSize('40%', '50%')
var ed2 = editor.editor2.editor
var val = ed.getValue();
var val2 = ed2.getValue();
var canon = '';

ed.on('change', function(from, to, txt){
  var n = ed.getValue();
	if(n === val) return
	else{
	  var d = adiff.diff([val], [n])
	  var x = val;
	  val = n
	  ws.write(JSON.stringify(d))		
	}

})

ws.on('secondary', function(){
	console.log('second')
	secondary = true
})

ws.on('data', function(d){
	if(d === '##secondary') {
		console.log('second')
		
		secondary = true
		return
	}
  var n = ed2.getValue();
  var x = val2;
	if(secondary){
		ed.setValue(d)		
	}

//	ed2.setValue(adiff.patch([n], JSON.parse(d))[0])
//  console.log(n, diff.applyPatch(n, d))
//  ed2.setValue(diff.applyPatch(n, d))
})

function getDiffByIndex(index){
	  var str = '';
	  for(var x = 0; x < index; x++) {
			str =	diff.applyPatch(str, diffs[x].diff)
	  }
	  return str
}