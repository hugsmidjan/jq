// encoding: utf-8
// $.fn.videoLinks 1.0  -- (c) 2011 Hugsmiðjan ehf.
(function(g){var k='<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',l='<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',i=document.location.protocol,i=i=='file:'?'http:':i,m=function(h){var c=g(this),d=c.data('playvideo_data'),e=d.videoHref,j=d.type,f,a=false,b=d.videoHeight;if(j=='youtube'){var n=e.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i)[1];f=i+'//www.youtube.com/embed/'+n+'?rel=0';b=b+30;a=true}else if(j=='vimeo'){var o=e.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i)[1];f=i+'//player.vimeo.com/video/'+o+'?title=1&amp;byline=0&amp;portrait=0';a=true}else if(j=='file'){f='/bitar/common/media/mediaplayer.swf?file='+e;b=b+20}if(a){c.html(g.inject(l,{vidurl:f,vidwi:d.videoWidth,vidhe:b}))}else{c.html(g.inject(k,{vidurl:f,vidwi:d.videoWidth,vidhe:b}))}c.append('<span class="videocaption">'+d.vidCapt+'</span>')};g.fn.videoLinks=function(a){var b=this;if(b.length){a=g.extend({vidWidth:'auto',vidHeight:'auto',aspect4x3:false},a);b.each(function(){var h=g(this),c=h.attr('href'),d=(/\.youtube\.com/i.test(c)&&'youtube')||(/\.(flv|mp4|m4v)(\?|$)/i.test(c)&&'file')||(/vimeo\.com/i.test(c)&&'vimeo')||undefined,e=(a.vidWidth=='auto')?h.closest('div, p').width():a.vidWidth,j=(a.vidHeight=='auto'&&a.aspect4x3)?(e/4)*3:(a.vidHeight=='auto'&&!a.aspect4x3)?(e/16)*9:a.vidHeight,f={videoHref:c,type:d,vidCapt:h.text(),videoWidth:e,videoHeight:Math.round(j)};if(d){h.wrap('<span class="videoblock" />').parent().data('playvideo_data',f).run(m);h.remove()}})}return b}})(jQuery);
  