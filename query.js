// encoding: utf-8
// jQuery.fn.query 1.1 - MIT/GPL Licensed - More info: http://github.com/maranomynet/jqueryquery/
jQuery.fn.query=function(c){var d=jQuery,a=this,f=a.length===1&&a[0]==document,g=/\s/.test(c.replace(/\s*([|~*$\^!]?=|,)\s*/g,'$1')),b;if(f||g){b=d(c);if(!f){b=b.filter(function(){var e=a.length;while(e--){if(a[e]===this||d.contains(a[e],this)){return true}}return false})}}else{b=a.filter(c).add(a.find(c))}return d(b)};
