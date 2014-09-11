/*
 getter v0.0.2
 2014 - kevin von flotow
 MIT license
*/
(function(g){function e(a){if("undefined"===typeof a)return console.log("Getter: selector is not defined");if(!(this instanceof e))return new e(a);this.length=0;if(Array.isArray(a))for(var b=0,c=a.length;b<c;++b)k.call(this,a[b]);else k.call(this,a.toString());m.call(this)}function k(a){if(a.appendChild)this[this.length++]=a;else{a=a.toString();for(var b=[],c=0,d;4>c;++c)if(d=n[c],!d.regex||d.regex.test(a)){b=d.fn(a);break}for(a=b.length;this.length<a;)this[this.length]=b[this.length++]}}function h(a,
b){Array.isArray(a)||(a=a.split(" "));for(var c=0,d=a.length;c<d;++c)b(a[c])}function m(){var a=this;Object.defineProperty(a,"classList",{value:{add:function(b){h(b,function(b){for(var d=0;d<a.length;++d)a[d].classList.add(b)})},contains:function(b){return a[0]?a[0].classList.contains(b):!1},remove:function(b){h(b,function(b){for(var d=0;d<a.length;++d)a[d].classList.remove(b)})},toggle:function(b){h(b,function(b){for(var d=0;d<a.length;++d)a[d].classList.toggle(b)})}}})}var f=g.document,l=function(a){return a.matches?
"matches":a.matchesSelector?"matchesSelector":a.webkitMatchesSelector?"webkitMatchesSelector":a.mozMatchesSelector?"mozMatchesSelector":a.msMatchesSelector?"msMatchesSelector":a.oMatchesSelector?"oMatchesSelector":!1}(f.documentElement);e.logging=function(a){};var n=[{regex:/^#[-A-Za-z0-9_][-A-Za-z0-9_:.]*$/,fn:function(a){var b=[];(a=f.getElementById(a.substr(1)))&&b.push(a);return b}},{regex:/^\.[-A-Za-z0-9_:.]*$/,fn:function(a){return f.getElementsByClassName(a.substr(1))}},{regex:/^[A-Za-z][-A-Za-z0-9_:.]*$/,
fn:function(a){return f.getElementsByTagName(a)}},{fn:function(a){return f.querySelectorAll(a)}}];e.prototype.each=function(a){for(var b=0;b<this.length;++b)a.call(this,this[b],b);return this};e.prototype.eq=function(a){};e.prototype.exec=function(){var a=arguments;if(0!==a.length){var b=Array.prototype.shift.call(a);if(0!==this.length){if(!this[0][b])return console.log("getter: method does not exist");for(var c=0;c<this.length;++c)this[c][b].apply(this[c],a)}}};e.prototype.filter=function(a){for(var b=
0,c=[];b<this.length;++b)this[b][l](a)&&c.push(this[b]);return new e(c)};e.prototype.first=function(){return this[0]?new e(this[0]):this};e.prototype.is=function(a){return this[0]?this[0][l](a):!1};e.prototype.last=function(){return this[0]?new e(this[this.length-1]):this};e.prototype.remove=function(){for(var a=0,b;a<this.length;++a)b=this[a],b.remove?b.remove():b.parentNode&&b.parentNode.removeChild&&b.parentNode.removeChild(b);this.length=0};e.prototype.set=function(a,b){if(0!==this.length){if(!this[0].hasOwnProperty(a))return console.log("getter: property does not exist");
for(var c=0;c<this.length;++c)this[c][a]=b;return this}};g.Getter=e;"undefined"===typeof g.$&&(g.$=e)})(window);
