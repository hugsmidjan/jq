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
      videoTempl =  '<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls %{auto}><source src="%{vidurl}" type="video/%{mime}"></source></video>',

      calcHeight = function (width, aspect4x3) {
        var vdHeight = aspect4x3 ? (width/4)*3 :
                       (width/16)*9;
        return Math.round(vdHeight);
      },

      playVideo = function(/*e*/) {
          var item = $(this),
              data = item.data('playvideo_data'),
              videoHref = data.videoHref,
              type = data.type,
              vidWidth = data.vidWidth !== 'auto' ? data.vidWidth : data.contElm.width(),
              newWidth, // used for responsive
              vidHeight = data.vidHeight !== 'auto' ? data.vidHeight : calcHeight(vidWidth, data.aspect4x3),
              videoUrl,
              videoId,
              mimetype,
              autoplay = '',
              playerHeight = 0,
              vidFrame = 'iframe';

          if ( type === 'youtube' || type === 'youtu' )
          {
            /*
              urls to handle:
              http://www.youtube.com/watch?v=nTasT5h0LEg&feature=topvideos
              http://www.youtube.com/embed/nTasT5h0LEg/
              http://www.youtube.com/embed/nTasT5h0LEg?rel=0
              http://www.youtube.com/embed/nTasT5h0LEg
              http://youtu.be/nTasT5h0LEg
            */
            videoId = type === 'youtube' ? videoHref.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i) : videoHref.match(/\.be\/(.+)$/);
            videoId = videoId && videoId[1];
            autoplay = data.autostart ? '&autoplay=1' : '';
            videoUrl = docLocPC + '//www.youtube.com/embed/' + videoId + '?rel=0' + autoplay;
            playerHeight = 30;
          }
          else if ( type === 'vimeo' )
          {
            /*
              urls to handle:
              http://player.vimeo.com/video/3274372
              http://vimeo.com/3274372/
              http://vimeo.com/3274372?title=1
              http://vimeo.com/3274372
            */
            videoId = videoHref.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i);
            videoId = videoId && videoId[1];
            autoplay = data.autostart ? '&autoplay=1' : '';
            videoUrl = docLocPC + '//player.vimeo.com/video/'+ videoId +'?title=1&amp;byline=0&amp;portrait=0' + autoplay;
          }
          else if ( type === 'facebook' )
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
            videoId = videoHref.match(/(?:\/v\/|[?&]v=)(\d{10,20})/); // matches v/nnnnn or v=nnnnn
            videoId = videoId && videoId[1];
            videoUrl = docLocPC + '//www.facebook.com/video/embed?video_id='+ videoId;
          }
          else if ( type === 'file' )
          {
            var mp4v = document.createElement('video'),
                mp4Support = !!mp4v.canPlayType && mp4v.canPlayType('video/mp4').replace(/no/, ''),
                movSupport = !!mp4v.canPlayType && mp4v.canPlayType('video/quicktime').replace(/no/, '');
            if ( mp4Support && /\.(mp4|m4v)(\?|$)/i.test( videoHref ) )
            {
              videoUrl = videoHref;
              vidFrame = 'video';
              autoplay = data.autostart ? 'autoplay' : '';
              mimetype = 'mp4';
            }
            else if ( movSupport && /\.mov(\?|$)/i.test( videoHref ) )
            {
              videoUrl = videoHref;
              vidFrame = 'video';
              autoplay = data.autostart ? 'autoplay' : '';
              mimetype = 'quicktime';
            }
            else
            {
              autoplay = data.autostart ? '&autostart=true' : '';
              videoUrl = '/bitar/common/media/mediaplayer.swf?file=' + videoHref + autoplay;
              playerHeight = 20;
              vidFrame = 'flash';
            }
          }
          else
          {
            // Everything else
            videoUrl = videoHref;
          }

          vidHeight = vidHeight + playerHeight; //add player height to video height

          if (vidFrame == 'iframe')
          {
            item.html($.inject(iframeTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight
                        }));
          }
          else if (vidFrame == 'video')
          {
            item.html($.inject(videoTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight,
                          auto   : autoplay
                        }));
          }
          else if (vidFrame == 'flash')
          {
            item.html($.inject(objectTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight
                        }));
          }

          item.append('<span class="videocaption">'+  data.vidCapt +'</span>');

          if (vidFrame != 'flash' && data.vidWidth === 'auto')
          {
            $(window).on('resize', function (/*e*/) {
                newWidth = data.contElm.width();
                if (newWidth !== vidWidth)
                {
                  vidWidth = newWidth;
                  vidWidth = data.contElm.width();
                  vidHeight = calcHeight(vidWidth, data.aspect4x3) + playerHeight;
                  item.find('iframe,video').attr('height',vidHeight).attr('width',vidWidth);
                }
              });
          }

      }, // end fn
      docLocPC = document.location.protocol;
  docLocPC = docLocPC === 'file:' ? 'http:' : docLocPC;

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
                          (/\.(flv|mp4|m4v|mov)(\?|$)/i.test( videoHref ) && 'file') ||
                          (/vimeo\.com/i.test( videoHref ) && 'vimeo') ||
                          (/youtu\.be/i.test( videoHref ) && 'youtu') ||
                          (/facebook\.com/i.test( videoHref ) && 'facebook') ||
                          undefined,
                  data = {
                      videoHref:   videoHref,
                      type:        type,
                      vidCapt:     link.text(),
                      vidWidth:    cfg.vidWidth,
                      vidHeight:   cfg.vidHeight,
                      autostart:   !!cfg.autostart,
                      aspect4x3:   cfg.aspect4x3
                    };

              if (type)
              {
                var wrapper = link.wrap('<span class="videoblock" />').parent();
                data.contElm = $(wrapper);
                while ( data.contElm[0]  &&  data.contElm.css('display')==='inline' )
                {
                  data.contElm = $(data.contElm.parent());
                }
                wrapper
                    .data( 'playvideo_data', data )
                    .run(playVideo);
                link.remove();
              }

            });
    }

    return videoLinks;
  };

})(jQuery);