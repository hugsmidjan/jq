// array.sortISL.js -- MIT/GPL -- https://gist.github.com/maranomynet/9972930
(function(){var r={};var e="| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö";var a=function(a){var t="";a=(a.trim?a.trim():a.replace(/^\s+|\s+$/g,"")).replace(/[\/.,()]/g,"").replace(/\s*-\s*/g,"-").replace(/(_|\s)+/g," ").toLowerCase();var n=a.length;var i=0;while(i<n){var o=a.charAt(i);var v=r[o];if(!v){var c=e.indexOf(o);c=c>-1?32+c:99+o.charCodeAt(0);v=r[o]=String.fromCharCode(c)}t+=v;i++}return t};Array.prototype.sortISL=function(r){r=r||function(r){return""+r};var e=this;var t=[];var n=e.length;var i=0;while(i<n){t[i]=[a(r(e[i])),e[i]];i++}t.sort(function(r,e){return r[0]===e[0]?0:r[0]>e[0]?1:-1});i=0;while(i<n){e[i]=t[i][1];i++}return e}})();