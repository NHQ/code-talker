var Editor = require('javascript-editor');
var Emitter = require('events').EventEmitter
var fs = require('fs');
var diff = window.diff = require('diff');
var store = window.store = require('store');
var diffs = [];
var txt = fs.readFileSync('./self.txt');
var lastCompile = txt + '';
var firstDifObject = {
	diff: diff.createPatch('http://secret.synth.fm', '', lastCompile),
	time: new Date().getTime()
}

diffs.push(firstDifObject)

var s1 = fs.readFileSync('./css/codemirror.css');
var s3 = fs.readFileSync('./css/style.css');
var s2 = fs.readFileSync('./css/theme.css');

var css = s1 + s2 + s3;

(function(window, document){

  module.exports = function(){
    
    var emitter = new Emitter()
    
    window.getDiffs = getDiffByIndex;

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style)
  
    var div = document.createElement('div');
    div.classList.add('editor');
    div.classList.add('left');
    document.body.appendChild(div);

    var ed = Editor({ container: div, value: txt, updateInterval: Infinity, viewportMargin: Infinity})

    var div2 = document.createElement('div');
    div2.classList.add('editor');
    div2.classList.add('right');
    document.body.appendChild(div2);

    var ed2 = Editor({ container: div2, value: txt, updateInterval: Infinity, viewportMargin: Infinity, readOnly: true})

//    ed.editor.addKeyMap({'Shift-Enter': keyMap, 'Alt-Enter':keyMap, 'Cmd-Enter': keyMapLine})
    
    return {editor: ed, editor2: ed2, element: div, style: style}
        
    function getDiffByIndex(index){
      var str = '';
      for(var x = 0; x < index; x++) {
	str =	diff.applyPatch(str, diffs[x].diff)
      }
      return str
    }
  }

})(window, document)
