(function(b){var h,f=document.location,r=f.hostname,s=f.port;var g=b.fn.anchorTags=function(d){var w=this,i=this.length;if(i){var a=b.extend({patterns:{}},g.config),j=d.localDomains||[],t,u=d.patterns,k=g.patterns;delete d.patterns;b.extend(a,d);if(a.usePatterns){b.each(a.usePatterns,function(x,l){k[l]&&(a.patterns[l]=k[l])})}else{b.extend(a.patterns,k)}b.extend(a.patterns,u);d.patterns=u;j=j.concat(a.baseDomains);t=new RegExp('^([a-z]{3,12}):\/\/('+j.join('|').replace(/\./g,'\.').replace(/\\\\\./g,'.')+')(/|$)','i');while(i--){var c=w[i],e=b(c),m=c.href,v=0;if(c.protocol=='mailto:'){e.addClass(a.emailClass)}else{if(c.protocol){var n=c.protocol=='https:';_isHttp=c.protocol=='http:';if(n){e.addClass(a.secureClass)}if(a.externalClass&&(((_isHttp||n)&&!t.test(m))||(!_isHttp&&!n&&f.protocol!=c.protocol))){e.addClass(a.externalClass);v=1}}if(!v&&a.internalClass){h=h||new RegExp("^("+f.toString().replace(/^https?:/,'https?:').split('#')[0].replace(/\./g,'\.')+")?#.",'i');h.test(m)&&e.addClass(a.internalClass)}for(var o in a.patterns){var p=a.patterns[o]||{},q=p.check||p;_0=b.isFunction(q)?q(c,o):null;if(_0||q.test(m)){e.addClass(p.tag||(_0&&_0.charAt&&_0)||a.patternClassPrefix+o)}}}}return this}};g.config={baseDomains:r?[r+(s?':'+s:'')]:[],localDomains:[],emailClass:'mailto',externalClass:'external',internalClass:'withinpage',patternClassPrefix:'file_',secureClass:'secure'};g.patterns={image:{check:/\.(jpe?g|png|gif)($|#|\?)/i},audio:{check:/\.(mp3|wav|aac|wma|flac|ogg)($|#|\?)/i},video:{check:/\.(m(ov|pe?g|p4)|avi|wmv)($|#|\?)/i},pdf:{check:/\.(pdf)($|#|\?)/i},doc:{check:/\.(docx?|rtf|wri|odt|sxw)(#|$|\?)/i},xls:{check:/\.(xlsx?|csv|ods|sxc)(#|$|\?)/i}}})(jQuery);
