// encoding: utf-8
// $.fn.anchorTags 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(b){var i,f=document.location,s=f.hostname,t=f.port;var g=b.fn.anchorTags=function(d){d=d||{};var u=this.filter('[href]'),j=u.length;if(j){var a=b.extend({patterns:{}},g.config),k=d.localDomains||[],v,w=d.patterns,l=g.patterns;delete d.patterns;b.extend(a,d);if(a.usePatterns){b.each(a.usePatterns,function(z,m){l[m]&&(a.patterns[m]=l[m])})}else{b.extend(a.patterns,l)}b.extend(a.patterns,w);d.patterns=w;k=k.concat(a.baseDomains);v=new RegExp('^([a-z]{3,12}):\/\/('+k.join('|').replace(/\./g,'\.').replace(/\\\./g,'.')+')(/|$)','i');while(j--){var h=u[j],e=b(h),n=h.href,x=0,c=h.protocol;if(c=='mailto:'){e.addClass(a.emailClass)}else{if(!/^(javascript|data):/.test(c)){if(c){var o=c=='https:',y=c=='http:';if(o){e.addClass(a.secureClass)}if(a.externalClass&&(((y||o)&&!v.test(n))||(!y&&!o&&f.protocol!=c))){e.addClass(a.externalClass);x=1}}if(!x&&a.internalClass){i=i||new RegExp("^("+f.toString().replace(/^https?:/,'https?:').split('#')[0].replace(/\./g,'\.')+")?#.",'i');i.test(n)&&e.addClass(a.internalClass)}}for(var p in a.patterns){var q=a.patterns[p]||{},r=q.check||q;_0=b.isFunction(r)?r(h,p):null;if(_0||r.test(n)){e.addClass(q.tag||(_0&&_0.charAt&&_0)||a.patternClassPrefix+p)}}}}}return this};g.config={baseDomains:s?[s+(t?':'+t:'')]:[],localDomains:[],emailClass:'mailto',externalClass:'external',internalClass:'withinpage',patternClassPrefix:'file_',secureClass:'secure'};g.patterns={image:{check:/\.(jpe?g|png|gif)($|#|\?)/i},audio:{check:/\.(mp3|wav|aac|wma|flac|ogg)($|#|\?)/i},video:{check:/\.(m(ov|pe?g|p4)|avi|wmv)($|#|\?)/i},pdf:{check:/\.(pdf)($|#|\?)/i},doc:{check:/\.(docx?|rtf|wri|odt|sxw)(#|$|\?)/i},xls:{check:/\.(xlsx?|csv|ods|sxc)(#|$|\?)/i}}})(jQuery);
