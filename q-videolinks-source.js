// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.videoLinks v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
//   * Már Örlygsson             -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils  (uses: $.inject() )

// Uses anchor href  to inject proper player for videos into articles
// Supports youtube, vimeo and videos encoded in flv or h.264+AAC MP4
// Auto calculates dimensions based on closest container width
// Usage:
//  - $('.article a.videolink').videoLinks();

(function($){

  var objectTempl = '<object id="video" width="%{vidwi}" height="%{vidhe}">' +
                      '<param name="movie" value="%{vidurl}"></param>' +
                      '<param name="wmode" value="transparent"></param>' +
                      '<param name="allowFullScreen" value="true"></param>' +
                      '<param name="allowscriptaccess" value="always"></param>' +
                      '<embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed>' +
                    '</object>',

      iframeTempl = '<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',

      docLocPC = document.location.protocol,
      docLocPC = docLocPC == 'file:' ? 'http:' : docLocPC,

      playVideo = function(e) {
          var item = $(this),
              data = item.data('playvideo_data'),
              videoHref = data.videoHref,
              type = data.type,
              videoUrl,
              autoplay,
              useIframe = false,
              vidFinHeight = data.videoHeight;

          if ( type == 'youtube' || type == 'youtu' )
          {
            /*
              urls to handle:
              http://www.youtube.com/watch?v=nTasT5h0LEg&feature=topvideos
              http://www.youtube.com/embed/nTasT5h0LEg/
              http://www.youtube.com/embed/nTasT5h0LEg?rel=0
              http://www.youtube.com/embed/nTasT5h0LEg
              http://youtu.be/nTasT5h0LEg
            */
            var youtubeId = type == 'youtube' ? videoHref.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i) : videoHref.match(/\.be\/(.+)$/);
            youtubeId = youtubeId && youtubeId[1];
            autoplay = data.autostart ? '&autoplay=1' : '';
            videoUrl = docLocPC + '//www.youtube.com/embed/' + youtubeId + '?rel=0' + autoplay;
            vidFinHeight = vidFinHeight + 30; //add player height to video height
            useIframe = true;
          }
          else if ( type == 'vimeo' )
          {
            /*
              urls to handle:
              http://player.vimeo.com/video/3274372
              http://vimeo.com/3274372/
              http://vimeo.com/3274372?title=1
              http://vimeo.com/3274372
            */
            var videoId = videoHref.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i);
            videoId = videoId && videoId[1];
            autoplay = data.autostart ? '&autoplay=1' : '';
            videoUrl = docLocPC + '//player.vimeo.com/video/'+ videoId +'?title=1&amp;byline=0&amp;portrait=0' + autoplay;
            useIframe = true;
          }
          else if ( type == 'facebook' )
          {
            /*
              urls to handle:
              http://www.facebook.com/v/2246424718688
              https://www.facebook.com/video/video.php?v=10150469623167067
              http://www.facebook.com/video/video.php?v=2246424718688
              http://www.facebook.com/photo/photo.php?v=2246424718688
              http://www.facebook.com/photo.php?v=2246424718688                
              https://www.facebook.com/photo.php?v=2427791652748&set=vb.144567668911104&type=2&theater
            */
            var videoId = videoHref.match(/(?:\/v\/|[?&]v=)(\d{10,20})/); // matches v/nnnnn or v=nnnnn
            videoId = videoId && videoId[1];
            videoUrl = docLocPC + '//www.facebook.com/v/'+ videoId;
          }
          else if ( type == 'file' )
          {
            autoplay = data.autostart ? '&autostart=true' : '';
            videoUrl = '/bitar/common/media/mediaplayer.swf?file=' + videoHref + autoplay;
            vidFinHeight = vidFinHeight + 20; //add player height to video height
          }
          
          if (useIframe)
          {
            item.html($.inject(iframeTempl, {
                          vidurl : videoUrl,
                          vidwi  : data.videoWidth,
                          vidhe  : vidFinHeight
                        }))
          } 
          else 
          {
            item.html($.inject(objectTempl, {
                          vidurl : videoUrl,
                          vidwi  : data.videoWidth,
                          vidhe  : vidFinHeight
                        }))
          }

          item.append('<span class="videocaption">'+  data.vidCapt +'</span>');
        }; // end fn

  $.fn.videoLinks = function ( cfg ) {
    var videoLinks = this;

    if (videoLinks.length)
    {
      cfg = $.extend({
              //autostart: false, // Q: Should we change this default to true?
              vidWidth:  'auto', //integer or 'auto' ()
              vidHeight: 'auto',
              aspect4x3:  false
            }, cfg );


      videoLinks
          .each(function () {
              var link = $(this),
                  videoHref = link.attr('href'),
                  type =  (/\.youtube\.com/i.test( videoHref ) && 'youtube') ||
                          (/\.(flv|mp4|m4v)(\?|$)/i.test( videoHref ) && 'file') ||
                          (/vimeo\.com/i.test( videoHref ) && 'vimeo') ||
                          (/youtu\.be/i.test( videoHref ) && 'youtu') ||
                          (/facebook\.com/i.test( videoHref ) && 'facebook') ||
                          undefined,
                  cntWidth = (cfg.vidWidth == 'auto') ? link.closest('div, p').width() : cfg.vidWidth,
                  vdHeight = (cfg.vidHeight == 'auto' && cfg.aspect4x3) ? (cntWidth/4)*3 :  
                             (cfg.vidHeight == 'auto' && !cfg.aspect4x3) ? (cntWidth/16)*9 : 
                             cfg.vidHeight,
                  data = {
                      videoHref:   videoHref,
                      type:        type,
                      vidCapt:     link.text(),
                      videoWidth:  cntWidth,
                      videoHeight: Math.round(vdHeight),
                      autostart:   !!cfg.autostart
                    };

              if (type)
              {
                link
                    .wrap('<span class="videoblock" />')
                    .parent()
                    .data( 'playvideo_data', data )
                    .run(playVideo);
                link.remove();
              }

            });
    }

    return videoLinks;
  };

})(jQuery);