(function(b){var h,g=document.location,p=g.hostname,q=g.port;var d=b.fn.anchorTags=function(e){var v=this,i=this.length;if(i){var a=b.extend({patterns:{}},d.config),j=e.localDomains||[],r,s=e.patterns;delete e.patterns;b.extend(a,e);if(a.usePatterns){b.each(a.usePatterns,function(w,t){a.patterns[t]=d.patterns[t]})}else{b.extend(a.patterns,d.patterns)}b.extend(a.patterns,s);e.patterns=s;j=j.concat(a.baseDomains);r=new RegExp('^([a-z]{3,12}):\/\/('+j.join('|').replace(/\./g,'\.').replace(/\\\\\./g,'.')+')(/|$)','i');while(i--){var c=v[i],f=b(c),k=c.href,u=0;if(c.protocol=='mailto:'){f.addClass(a.emailClass)}else{if(c.protocol){var l=c.protocol=='https:';_isHttp=c.protocol=='http:';if(l){f.addClass(a.secureClass)}if(a.externalClass&&(((_isHttp||l)&&!r.test(k))||(!_isHttp&&!l&&g.protocol!=c.protocol))){f.addClass(a.externalClass);u=1}}if(!u&&a.internalClass){h=h||new RegExp("^("+g.toString().replace(/^https?:/,'https?:').split('#')[0].replace(/\./g,'\.')+")?#.",'i');h.test(k)&&f.addClass(a.internalClass)}for(var m in a.patterns){var n=a.patterns[m]||{},o=n.check||n;_0=b.isFunction(o)?o(c,m):null;if(_0||o.test(k)){f.addClass(n.tag||(_0&&_0.charAt&&_0)||a.patternClassPrefix+m)}}}}return this}};d.config={baseDomains:p?[p+(q?':'+q:'')]:[],localDomains:[],emailClass:'mailto',externalClass:'external',internalClass:'withinpage',patternClassPrefix:'file_',secureClass:'secure'};d.patterns={image:{check:/\.(jpe?g|png|gif)($|#|\?)/i},audio:{check:/\.(mp3|wav|aac|wma|flac|ogg)($|#|\?)/i},video:{check:/\.(m(ov|pe?g|p4)|avi|wmv)($|#|\?)/i},pdf:{check:/\.(pdf)($|#|\?)/i},doc:{check:/\.(docx?|rtf|wri|odt|sxw)(#|$|\?)/i},xls:{check:/\.(xlsx?|csv|ods|sxc)(#|$|\?)/i}}})(jQuery);
