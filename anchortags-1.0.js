(function(e){var j,t='^([a-z]{3,12}):\/\/(',h=document.location,p=h.hostname,q=h.port;var i=e.fn.anchorTags=function(f){var u=this,k=this.length;if(k){var a=e.extend({patterns:{}},i.config),g=f.localDomains,r,s=f.patterns;delete f.patterns;e.extend(a,f);e.extend(a.patterns,i.patterns,s);f.patterns=s;g=(g.charAt?g.split(/\s*,\s*/):g).concat(a.baseDomains);j=j||new RegExp("^("+h.toString().replace(/^https?:/,'https?:').replace(/#.*$/,'')+")?#.",'i');r=new RegExp(t+g.join('|').replace(/\./g,'\.').replace(/\\\\\./g,'.')+')','i');while(k--){var l=u[k],d=e(l),b=l.href,m=0;if(/^mailto:/i.test(b)){d.addClass(a.emailClass)}else{if(/^[a-z]{3,12}:\/\//i.test(b)){if(/^https?:/i.test(b)){if(b.charAt(4)=='s'){d.addClass(a.secureClass)}if(!r.test(b)){d.addClass(a.externalClass);m=1}}else if(h.protocol!='file:'||!/^file:/.test(b)){d.addClass(a.externalClass);m=1}}if(!m&&j.test(b)){d.addClass(a.internalClass)}for(var n in a.patterns){var c=a.patterns[n],o;if(c.splice){c=c[0];o=c[1]}if(c&&c.test(b)){d.addClass(o?o(l,c,n):n)}}}}return this}};i.config={baseDomains:p?[p+(q?'(:'+q+')':'')]:[],localDomains:[],emailClass:'mailto',externalClass:'external',internalClass:'withinpage',secureClass:'secure'};i.patterns={file_image:/\.(jpe?g|png|gif)($|#|\?)/i,file_audio:/\.(mp3|ogg|wav)($|#|\?)/i,file_video:/\.(m(ov|pg)|avi|wmv)($|#|\?)/i,file_pdf:/\.(pdf)($|#|\?)/i,file_doc:/\.(docx?|rtf|wri)(#|$|\?)/i}})(jQuery);