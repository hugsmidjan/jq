// encoding: utf-8
// $.fn.videoLinks 1.0  -- (c) 2011 Hugsmiðjan ehf.
(function(e){var m='<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',n='<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',h=document.location.protocol,h=h=='file:'?'http:':h,o=function(f,i){var d=e(this),k=d.data('playvideo_cfg'),c=d.data('playvideo_data'),j=c.videoHref,a=c.type,b,l=false,g=c.videoHeight;if(a=='youtube'){var p=j.match(/(?:embed\/|watch\/?\?v=)([^&]+)/i)[1];b=h+'//www.youtube.com/embed/'+p+'?rel=0';g=g+30;l=true}else if(a=='vimeo'){var q=j.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i)[1];b=h+'//player.vimeo.com/video/'+q+'?title=1&amp;byline=0&amp;portrait=0';l=true}else if(a=='file'){b='/bitar/common/media/mediaplayer.swf?file='+j;g=g+20}if(l){d.html(e.inject(n,{vidurl:b,vidwi:c.videoWidth,vidhe:g}))}else{d.html(e.inject(m,{vidurl:b,vidwi:c.videoWidth,vidhe:g}))}d.append('<span class="videocaption">'+c.vidCapt+'</span>')};e.fn.videoLinks=function(a){var b=this;if(b.length){a=e.extend({vidWidth:'auto',vidHeight:'auto',aspect4x3:false},a);b.each(function(){var f=e(this),i=f.attr('href'),d=(/\.youtube\.com/i.test(i)&&'youtube')||(/\.(flv|mp4|m4v)(\?|$)/i.test(i)&&'file')||(/vimeo\.com/i.test(i)&&'vimeo')||'',k=(a.vidWidth=='auto')?f.closest('div, p').width():a.vidWidth,c=(a.vidHeight=='auto'&&a.aspect4x3)?(k/4)*3:(a.vidHeight=='auto'&&!a.aspect4x3)?(k/16)*9:a.vidHeight,j={videoHref:i,type:d,vidCapt:f.text(),videoWidth:k,videoHeight:Math.round(c)};f.wrap('<span class="videoblock" />').parent().data('playvideo_cfg',a).data('playvideo_data',j).run(o);f.remove()})}return b}})(jQuery);
  