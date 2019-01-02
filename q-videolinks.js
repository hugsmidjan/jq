/* $.fn.videoLinks 1.0  -- (c) 2011-2015 Hugsmiðjan ehf. @preserve */
!function(w){var b=function(e,t){var a=t?e/4*3:e/16*9;return Math.round(a)},r=function(){var e,t,a,i,o,l=w(this),r=l.data("playvideo_data"),c=r.videoHref,d=r.type,s="auto"!==r.cfg.vidWidth?r.cfg.vidWidth:r.contElm.width(),n="auto"!==r.cfg.vidHeight?r.cfg.vidHeight:b(s,r.cfg.aspect4x3),m="",u="",v=0,p="iframe";if("youtube"===d||"youtu"===d)a=(a="youtube"===d?c.match(/(?:embed\/|watch\/?\?v=)([^&?/]+)/i):c.match(/\.be\/(.+)$/))&&a[1],(i=(i=c.match(/[?&]list=([^&?/]+)/))&&"list="+i[1]+"&"||"")&&!a&&(a="videoseries"),m=r.cfg.autostart?"&autoplay=1":"",u=!0===r.cfg.autoHide?"":"&autohide="+r.cfg.autoHide,t=k+"//www.youtube-nocookie.com/embed/"+a+"?"+i+"rel=0&modestbranding=1&wmode=transparent"+m+u+r.cfg.filePlayerExtraParams,v=30;else if("vimeo"===d)a=(a=c.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i))&&a[1],m=r.cfg.autostart?"&autoplay=1":"",t=k+"//player.vimeo.com/video/"+a+"?title=1&amp;byline=0&amp;portrait=0"+m+r.cfg.filePlayerExtraParams;else if("facebook"===d)/\/videos\//.test(c)?(m=r.cfg.autostart?"&autoplay=true":"",t=k+"//www.facebook.com/v2.6/plugins/video.php?href="+encodeURIComponent(c)+"&locale="+r.cfg.locale+"&show_text=false"+m):(a=(a=c.match(/(?:\/v\/|\/videos\/|[?&]v=)(\d{10,20})/))&&a[1],t=k+"//www.facebook.com/video/embed?video_id="+a);else if("instagram"===d)p="blockquote",t=c,l.data("load-script",{scripttoken:"instgrm",scripturl:"//platform.instagram.com/"+r.cfg.locale+"/embeds.js",onload:"window.instgrm.Embeds.process()"});else if("file"===d){var f=document.createElement("video"),h=!!f.canPlayType&&f.canPlayType("video/mp4").replace(/no/,""),g=!!f.canPlayType&&f.canPlayType("video/quicktime").replace(/no/,"");h&&/\.(mp4|m4v)(\?|$)/i.test(c)?(t=c,p="video",m=r.cfg.autostart?"autoplay":"",o="mp4"):g&&/\.mov(\?|$)/i.test(c)?(t=c,p="video",m=r.cfg.autostart?"autoplay":"",o="quicktime"):(m=r.cfg.autostart?"&autostart=true":"",t=r.cfg.filePlayerUrl+c+m+r.cfg.filePlayerExtraParams,p=r.cfg.filePlayerFrame,n+=r.cfg.filePlayerHeight)}else t=c;"iframe"===p?l.html(w.inject('<iframe width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" scrolling="no" title="%{vidTitle}" allow="autoplay; encrypted-media" allowfullscreen></iframe>',{vidurl:t,vidwi:s,vidhe:n,vidTitle:r.vidCapt})):"video"===p?l.html(w.inject('<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls %{auto} controlslist="nodownload"><source src="%{vidurl}" type="video/%{mime}"></source></video>',{vidurl:t,vidwi:s,vidhe:n,auto:m,mime:o})):"blockquote"===p?l.html(w.inject('<blockquote class="%{class}" %{attributes} style="%{styles}"><a href="%{vidurl}"></a></blockquote>',{vidurl:t,class:"instagram-media",attributes:'data-instgrm-captioned data-instgrm-version="7"',styles:"margin:1px;padding:0;border:0;max-width:658px;width:calc(100% - 2px);"})):"flash"===p&&l.html(w.inject('<object id="video" width="%{vidwi}" height="%{vidhe}"><param name="movie" value="%{vidurl}"></param><param name="wmode" value="transparent"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed></object>',{vidurl:t,vidwi:s,vidhe:n})),r.cfg.useCaption&&0<r.vidCapt.length&&"instagram"!==p&&l.append('<span class="videocaption">'+r.vidCapt+"</span>"),"flash"!==p&&"instagram"!==d&&"auto"===r.cfg.vidWidth&&w(window).on("resize.videolinks",function(){(e=r.contElm.width())!==s&&(s=e,s=r.contElm.width(),n=b(s,r.cfg.aspect4x3)+v,l.find("iframe,video").attr("height",n).attr("width",s))});var y=l.data("load-script");y&&setTimeout(function(){if(window[y.scripttoken]){new Function(y.onload).apply(null)}else{var e=document.createElement("script");e.async=!0,e.defer=!0,e.src=y.scripturl,e.onload=y.onload,w("head").append(e)}},10)},k=document.location.protocol;k="file:"===k?"http:":k,w.fn.videoLinks=function(l){return this.length&&(l=w.extend({autostart:!1,vidWidth:"auto",vidHeight:"auto",aspect4x3:!1,useCaption:!0,type:null,autoHide:!0,locale:"en_US",filePlayerUrl:"/bitar/common/media/mediaplayer.swf?file=",filePlayerExtraParams:"",filePlayerHeight:20,filePlayerFrame:"flash"},l)),this.map(function(){var e=w(this),t=e.attr("href"),a=l.type||/\.youtube\.com/i.test(t)&&"youtube"||/youtu\.be/i.test(t)&&"youtu"||/vimeo\.com/i.test(t)&&"vimeo"||/facebook\.com/i.test(t)&&"facebook"||/instagram\.com/i.test(t)&&"instagram"||/\.(flv|mp4|m4v|mov)(\?|$)/i.test(t)&&"file"||void 0,i={cfg:l,videoHref:t,type:a,vidCapt:e.text().trim()},o=e.wrap('<span class="videoblock" />').parent();for(i.contElm=w(o);i.contElm[0]&&"inline"===i.contElm.css("display");)i.contElm=w(i.contElm.parent());return o.data("playvideo_data",i).run(r),e.remove(),o[0]})}}(jQuery);
