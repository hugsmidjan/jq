// encoding: utf-8
// $.fn.curtain 1.1  -- (c) 2010 Hugsmiðjan ehf.
(function(b){var g='curtain',j=b.browser.msie&&parseInt(b.browser.version,10)<7,p=!j?'min-':'',k=p+'width',l=p+'height',q='opacity',r=b[g]=function(a,c){if(a=='destroy'){var d=b.inArray(c,f);if(d>-1){b(c).remove();f.splice(d,1)}!f.length&&h.unbind('resize',m);return}if(a&&(a.tagName||a.jquery)){c=a;a={}}a=b.extend({className:g+'-overlay'},typeof(a)=='string'?{className:a}:typeof(a)=='boolean'&&a?{bg:'#888',opacity:.5,z:99}:a||{});j&&(a.fixed=0);var e=b(c||'<div />').hide().addClass(a.className).css({position:a.fixed?'fixed':'absolute',top:0,left:0}).css(k,'100%').css(l,'100%');if(!c||!c.parentNode){e.appendTo(document.body)}if(a.bg||a[q]||a.z){e.css({background:a.bg,opacity:a[q],zIndex:a.z})}if(!a.fixed){f.push(e[0]);i=i||b('body');h.bind('resize',m);m(1)}return e};b.fn[g]=function(a){return this.each(function(){b[g](a,this)})};var f=[],h=b(window),i,m=function(a){var c=f.length,d=-1,e=d;while(c--){var n=f[c],o=b(n);if(n&&((n.parentNode&&o.is(':visible'))||a==1)){d=(d!=-1)?d:Math.max(h.width(),i.innerWidth());e=(e!=-1)?e:Math.max(h.height(),i.innerHeight());j&&o.css(k,0).css(l,0);o.css(k,d).css(l,e)}}}})(jQuery);