// $.prettyNum 1.1  -- (c) 2010 Hugsmiðjan ehf.
(function(e){var f={},j=function(a){a=(typeof a=='string'?a:e(a||'body').closest('[lang]').attr('lang')||'').toLowerCase().substr(0,2)||'en';var b=f[a];if(!b){var d=a;while(a.length>2&&(a=a.substr(0,2))){if(f[a]){break}}b=f[d]=f[a]||f.en}b[2]=b[2]||new RegExp(b[0].replace('.','\\.'),'g');b[3]=b[3]||new RegExp('^([^'+b[0]+b[1]+']*)(\\d{3}(['+b[0]+b[1]+']|$))');return b};e.each([['en,es-do,es-gt,es-hn,es-mx,es-ni,es-pa,es-pe,es-sv,es-us',',.'],['de,dk,es,is,fr-be,it','.,'],['fi,fr,no,se',' ,'],['de-ch,de-li,fr-ch,it-ch',"'."]],function(a,b){var d=b[1].split(''),c=b[0].split(','),a=c.length;while(a--){f[c[a]]=d}});e.prettyNum={tokens:f,make:function(a,b,d){var c;if(arguments.length<3){if(typeof b=='boolean'){d=b;b=null}else if(e.isPlainObject(b)){c=b;b=null}}else if(e.isPlainObject(d)){c=d}d=c?c.trail:d;c=e.extend({milleSep:true},c);b=b||c.lang;if(a.jquery||a.nodeName){var i=e(a);a=i.val()||i.text();b=b||i}var g=j(b);a=(typeof a=='number')?a+'':e.trim(a+'').replace(/  */g,' ').replace(g[2],'').replace(g[1],'!!').replace(/\./g,'').replace(/!!/g,'.').replace(/^(-)?\./,'$10.').replace(/(.)-/g,'$1').replace(/[^\d-.]/g,'').replace(/^(-?\d*)(\.\d*)?.*$/,'$1$2');if(a){var h=c.decimals;if(h>=0){var l=Math.pow(10,h);a=''+Math.round(parseFloat(a)*l);if(h){var k=1+h-a.length;if(k>0){a=(new Array(k+1)).join('0')+a}a=a.substr(0,a.length-h)+'.'+a.substr(a.length-h)}}else if(!d){a=a.replace(/\.$/,'')}a=a.replace('.',g[1]);if(c.milleSep){while(g[3].test(a)){a=a.replace(g[3],'$1'+g[0]+'$2')}}a=a.replace(/^(-)?[^\d-]/,'$1')}return a},read:function(a,b){if(a.jquery||a.nodeName){var d=e(a);a=d.val()||d.text();b=b||d}var c=j(b);a=parseFloat(e.prettyNum.make(a,b).replace(c[2],'').replace(c[1],'.'));return isNaN(a)?null:a}}})(jQuery);
