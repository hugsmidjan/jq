// $.fn.videoLinks 1.0  -- (c) 2011 Hugsmiðjan ehf.
(function(h){var q='<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',r='<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',s='<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls><source src="%{vidurl}" type="video/mp4"></source></video>',o=function(c,a){var e=a?(c/4)*3:(c/16)*9;return Math.round(e)},t=function(){var c=h(this),a=c.data('playvideo_data'),e=a.videoHref,d=a.type,f=a.vidWidth!=='auto'?a.vidWidth:a.contElm.width(),i,g=a.vidHeight!=='auto'?a.vidHeight:o(f,a.aspect4x3),j,b,k='',n=0,l=false;if(d==='youtube'||d==='youtu'){b=d==='youtube'?e.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i):e.match(/\.be\/(.+)$/);b=b&&b[1];k=a.autostart?'&autoplay=1':'';j=m+'//www.youtube.com/embed/'+b+'?rel=0'+k;n=30;l='iframe'}else if(d==='vimeo'){b=e.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i);b=b&&b[1];k=a.autostart?'&autoplay=1':'';j=m+'//player.vimeo.com/video/'+b+'?title=1&amp;byline=0&amp;portrait=0'+k;l='iframe'}else if(d==='facebook'){b=e.match(/(?:\/v\/|[?&]v=)(\d{10,20})/);b=b&&b[1];j=m+'//www.facebook.com/video/embed?video_id='+b;l='iframe'}else if(d==='file'){var p=document.createElement('video'),u=!!p.canPlayType&&p.canPlayType('video/mp4').replace(/no/,'');if(u&&!/\.flv(\?|$)/i.test(e)){j=e;l='video';k=a.autostart?'autoplay':''}else{k=a.autostart?'&autostart=true':'';j='/bitar/common/media/mediaplayer.swf?file='+e+k;n=20}}g=g+n;if(l=='iframe'){c.html(h.inject(r,{vidurl:j,vidwi:f,vidhe:g}))}else if(l=='video'){c.html(h.inject(s,{vidurl:j,vidwi:f,vidhe:g,auto:k}))}else if(l=='flash'){c.html(h.inject(q,{vidurl:j,vidwi:f,vidhe:g}))}c.append('<span class="videocaption">'+a.vidCapt+'</span>');if(l!='flash'&&a.vidWidth==='auto'){h(window).on('resize',function(){i=a.contElm.width();if(i!==f){f=i;f=a.contElm.width();g=o(f,a.aspect4x3)+n;c.find('iframe,video').attr('height',g).attr('width',f)}})}},m=document.location.protocol;m=m==='file:'?'http:':m;h.fn.videoLinks=function(i){var g=this;if(g.length){i=h.extend({vidWidth:'auto',vidHeight:'auto',aspect4x3:false},i);g.each(function(){var c=h(this),a=c.attr('href'),e=(/\.youtube\.com/i.test(a)&&'youtube')||(/\.(flv|mp4|m4v|mov)(\?|$)/i.test(a)&&'file')||(/vimeo\.com/i.test(a)&&'vimeo')||(/youtu\.be/i.test(a)&&'youtu')||(/facebook\.com/i.test(a)&&'facebook')||undefined,d={videoHref:a,type:e,vidCapt:c.text(),vidWidth:i.vidWidth,vidHeight:i.vidHeight,autostart:!!i.autostart,aspect4x3:i.aspect4x3};if(e){var f=c.wrap('<span class="videoblock" />').parent();d.contElm=h(f);while(d.contElm[0]&&d.contElm.css('display')==='inline'){d.contElm=h(d.contElm.parent())}f.data('playvideo_data',d).run(t);c.remove()}})}return g}})(jQuery);
