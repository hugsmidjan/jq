// $.fn.cookie -- (c) 2006 Klaus Hartl (stilbuero.de) (Dual MIT and GPL)
(function(f){f.cookie=function(c,d,a){if(typeof d!='undefined'){a=a||{};if(d===null){d='';a.expires=-1}var g='';if(a.expires&&(typeof a.expires=='number'||a.expires.toUTCString)){var b;if(typeof a.expires=='number'){b=new Date();b.setTime(b.getTime()+(a.expires*24*60*60*1000))}else{b=a.expires}g='; expires='+b.toUTCString()}var k=a.path?'; path='+(a.path):'';var l=a.domain?'; domain='+(a.domain):'';var m=a.secure?'; secure':'';document.cookie=[c,'=',encodeURIComponent(d),g,k,l,m].join('')}else{var h=null;if(document.cookie&&document.cookie!=''){var i=document.cookie.split(';');for(var e=0;e<i.length;e++){var j=f.trim(i[e]);if(j.substring(0,c.length+1)==(c+'=')){h=decodeURIComponent(j.substring(c.length+1));break}}}return h}}})(jQuery);
