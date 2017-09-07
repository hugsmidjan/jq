/* $.fn.videoLinks 1.0  -- (c) 2011-2015 Hugsmiðjan ehf. @preserve */
!function(e){var t='<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',a='<iframe width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" scrolling="no" title="%{vidTitle}" allowfullscreen></iframe>',i='<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls %{auto}><source src="%{vidurl}" type="video/%{mime}"></source></video>',o='<blockquote class="%{class}" %{attributes} style="%{styles}"><a href="%{vidurl}"></a></blockquote>',r=function(e,t){var a=t?e/4*3:e/16*9;return Math.round(a)},l=function(){var l,c,s,n,m,v=e(this),u=v.data("playvideo_data"),p=u.videoHref,f=u.type,h="auto"!==u.cfg.vidWidth?u.cfg.vidWidth:u.contElm.width(),g="auto"!==u.cfg.vidHeight?u.cfg.vidHeight:r(h,u.cfg.aspect4x3),y="",w="",b=0,P="iframe";if("youtube"===f||"youtu"===f)s="youtube"===f?p.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i):p.match(/\.be\/(.+)$/),s=s&&s[1],n=p.match(/[?&]list=([^&?\/]+)/),n=n&&"list="+n[1]+"&",n&&!s&&(s="videoseries"),y=u.cfg.autostart?"&autoplay=1":"",w=u.cfg.autoHide===!0?"":"&autohide="+u.cfg.autoHide,c=d+"//www.youtube.com/embed/"+s+"?"+n+"rel=0&wmode=transparent"+y+w+u.cfg.filePlayerExtraParams,b=30;else if("vimeo"===f)s=p.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i),s=s&&s[1],y=u.cfg.autostart?"&autoplay=1":"",c=d+"//player.vimeo.com/video/"+s+"?title=1&amp;byline=0&amp;portrait=0"+y+u.cfg.filePlayerExtraParams;else if("facebook"===f)/\/videos\//.test(p)?c=d+"//www.facebook.com/v2.6/plugins/video.php?href="+encodeURIComponent(p)+"&locale=en_US&show_text=false":(s=p.match(/(?:\/v\/|\/videos\/|[?&]v=)(\d{10,20})/),s=s&&s[1],c=d+"//www.facebook.com/video/embed?video_id="+s);else if("instagram"===f)P="instagram",c=p,v.data("load-script",{scripttoken:"instgrm",scripturl:"//platform.instagram.com/en_US/embeds.js",onload:"window.instgrm.Embeds.process()"});else if("file"===f){var x=document.createElement("video"),E=!!x.canPlayType&&x.canPlayType("video/mp4").replace(/no/,""),k=!!x.canPlayType&&x.canPlayType("video/quicktime").replace(/no/,"");E&&/\.(mp4|m4v)(\?|$)/i.test(p)?(c=p,P="video",y=u.cfg.autostart?"autoplay":"",m="mp4"):k&&/\.mov(\?|$)/i.test(p)?(c=p,P="video",y=u.cfg.autostart?"autoplay":"",m="quicktime"):(y=u.cfg.autostart?"&autostart=true":"",c=u.cfg.filePlayerUrl+p+y+u.cfg.filePlayerExtraParams,P=u.cfg.filePlayerFrame,g+=u.cfg.filePlayerHeight)}else c=p;"iframe"===P?v.html(e.inject(a,{vidurl:c,vidwi:h,vidhe:g,vidTitle:u.vidCapt})):"video"===P?v.html(e.inject(i,{vidurl:c,vidwi:h,vidhe:g,auto:y})):"instagram"===P?v.html(e.inject(o,{vidurl:c,class:"instagram-media",attributes:'data-instgrm-captioned data-instgrm-version="7"',styles:"margin:1px;padding:0;border:0;max-width:658px;width:calc(100% - 2px);"})):"flash"===P&&v.html(e.inject(t,{vidurl:c,vidwi:h,vidhe:g})),u.cfg.useCaption&&u.vidCapt.length>0&&"instagram"!==P&&v.append('<span class="videocaption">'+u.vidCapt+"</span>"),"flash"!==P&&"auto"===u.cfg.vidWidth&&e(window).on("resize",function(){l=u.contElm.width(),l!==h&&(h=l,h=u.contElm.width(),g=r(h,u.cfg.aspect4x3)+b,v.find("iframe,video").attr("height",g).attr("width",h))});var H=v.data("load-script");H&&setTimeout(function(){if(window[H.scripttoken]){var t=new Function(H.onload);t.apply(null)}else{var a=document.createElement("script");a.async=!0,a.defer=!0,a.src=H.scripturl,a.onload=H.onload,e("head").append(a)}},10)},d=document.location.protocol;d="file:"===d?"http:":d,e.fn.videoLinks=function(t){var a=this;return a.length&&(t=e.extend({autostart:!1,vidWidth:"auto",vidHeight:"auto",aspect4x3:!1,useCaption:!0,type:null,autoHide:!0,filePlayerUrl:"/bitar/common/media/mediaplayer.swf?file=",filePlayerExtraParams:"",filePlayerHeight:20,filePlayerFrame:"flash"},t)),a.map(function(){var a=e(this),i=a.attr("href"),o=t.type||/\.youtube\.com/i.test(i)&&"youtube"||/youtu\.be/i.test(i)&&"youtu"||/vimeo\.com/i.test(i)&&"vimeo"||/facebook\.com/i.test(i)&&"facebook"||/instagram\.com/i.test(i)&&"instagram"||/\.(flv|mp4|m4v|mov)(\?|$)/i.test(i)&&"file"||void 0,r={cfg:t,videoHref:i,type:o,vidCapt:a.text().trim()},d=a.wrap('<span class="videoblock" />').parent();for(r.contElm=e(d);r.contElm[0]&&"inline"===r.contElm.css("display");)r.contElm=e(r.contElm.parent());return d.data("playvideo_data",r).run(l),a.remove(),d[0]})}}(jQuery);
