// $.fn.videoLinks 1.0  -- (c) 2011 Hugsmiðjan ehf.
(function(h){var r='<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',s='<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',t='<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls %{auto}><source src="%{vidurl}" type="video/%{mime}"></source></video>',p=function(c,a){var d=a?(c/4)*3:(c/16)*9;return Math.round(d)},u=function(){var c=h(this),a=c.data('playvideo_data'),d=a.videoHref,e=a.type,f=a.vidWidth!=='auto'?a.vidWidth:a.contElm.width(),i,g=a.vidHeight!=='auto'?a.vidHeight:p(f,a.aspect4x3),k,b,q,l='',n=0,j=false;if(e==='youtube'||e==='youtu'){b=e==='youtube'?d.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i):d.match(/\.be\/(.+)$/);b=b&&b[1];l=a.autostart?'&autoplay=1':'';k=m+'//www.youtube.com/embed/'+b+'?rel=0'+l;n=30;j='iframe'}else if(e==='vimeo'){b=d.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i);b=b&&b[1];l=a.autostart?'&autoplay=1':'';k=m+'//player.vimeo.com/video/'+b+'?title=1&amp;byline=0&amp;portrait=0'+l;j='iframe'}else if(e==='facebook'){b=d.match(/(?:\/v\/|[?&]v=)(\d{10,20})/);b=b&&b[1];k=m+'//www.facebook.com/video/embed?video_id='+b;j='iframe'}else if(e==='file'){var o=document.createElement('video'),v=!!o.canPlayType&&o.canPlayType('video/mp4').replace(/no/,''),w=!!o.canPlayType&&o.canPlayType('video/quicktime').replace(/no/,'');if(v&&/\.(mp4|m4v)(\?|$)/i.test(d)){k=d;j='video';l=a.autostart?'autoplay':'';q='mp4'}else if(w&&/\.mov(\?|$)/i.test(d)){k=d;j='video';l=a.autostart?'autoplay':'';q='quicktime'}else{l=a.autostart?'&autostart=true':'';k='/bitar/common/media/mediaplayer.swf?file='+d+l;n=20;j='flash'}}g=g+n;if(j=='iframe'){c.html(h.inject(s,{vidurl:k,vidwi:f,vidhe:g}))}else if(j=='video'){c.html(h.inject(t,{vidurl:k,vidwi:f,vidhe:g,auto:l}))}else if(j=='flash'){c.html(h.inject(r,{vidurl:k,vidwi:f,vidhe:g}))}c.append('<span class="videocaption">'+a.vidCapt+'</span>');if(j!='flash'&&a.vidWidth==='auto'){h(window).on('resize',function(){i=a.contElm.width();if(i!==f){f=i;f=a.contElm.width();g=p(f,a.aspect4x3)+n;c.find('iframe,video').attr('height',g).attr('width',f)}})}},m=document.location.protocol;m=m==='file:'?'http:':m;h.fn.videoLinks=function(i){var g=this;if(g.length){i=h.extend({vidWidth:'auto',vidHeight:'auto',aspect4x3:false},i);g.each(function(){var c=h(this),a=c.attr('href'),d=(/\.youtube\.com/i.test(a)&&'youtube')||(/\.(flv|mp4|m4v|mov)(\?|$)/i.test(a)&&'file')||(/vimeo\.com/i.test(a)&&'vimeo')||(/youtu\.be/i.test(a)&&'youtu')||(/facebook\.com/i.test(a)&&'facebook')||undefined,e={videoHref:a,type:d,vidCapt:c.text(),vidWidth:i.vidWidth,vidHeight:i.vidHeight,autostart:!!i.autostart,aspect4x3:i.aspect4x3};if(d){var f=c.wrap('<span class="videoblock" />').parent();e.contElm=h(f);while(e.contElm[0]&&e.contElm.css('display')==='inline'){e.contElm=h(e.contElm.parent())}f.data('playvideo_data',e).run(u);c.remove()}})}return g}})(jQuery);
