(function(e){var f={},g=function(a){a=(typeof a=='string'?a:e(a).closest('[lang]').attr('lang').toLowerCase())||'en';var b=f[a];if(!b){var d=a;while(a.length>2&&(a=a.substr(0,2))){if(f[a]){break}}b=f[d]=f[a]||f.en}b[2]=b[2]||new RegExp(b[0].replace('.','\\.'),'g');b[3]=b[3]||new RegExp('^([^'+b[0]+b[1]+']*)(\\d{3}(['+b[0]+b[1]+']|$))');return b};e.each([['en,es-do,es-gt,es-hn,es-mx,es-ni,es-pa,es-pe,es-sv,es-us',',.'],['de,dk,es,is,fr-be,it','.,'],['fi,fr,no,se',' ,'],['de-ch,de-li,fr-ch,it-ch',"'."]],function(d,c){var h=c[1].split('');e.each(c[0].split(','),function(a,b){f[b]=h})});e.prettyNum={make:function(a,b,d){var c=g(b);a=(typeof a=='number')?a+'':e.trim(a+'').replace(/  */g,' ').replace(c[2],'').replace(c[1],'!!').replace(/\./g,'').replace(/!!/g,'.').replace(/^(-)?\./,'$10.').replace(/(.)-/g,'$1').replace(/[^\d-.]/g,'').replace(/^(-?\d*)(\.\d*)?.*$/,'$1$2');if(a){if(!d){a=a.replace(/\.$/,'')}a=a.replace('.',c[1]);while(c[3].test(a)){a=a.replace(c[3],'$1'+c[0]+'$2')}a=a.replace(/^(-)?[^\d-]/,'$1')}return a},read:function(a,b){var d=g(b);a=parseFloat(e.prettyNum.make(a,b).replace(d[2],'').replace(d[1],'.'));return isNaN(a)?null:a}}})(jQuery);