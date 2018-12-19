/* $.fn.videoLinks 1.0  -- (c) 2011-2015 Hugsmiðjan ehf. @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.videoLinks v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011-2015 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Þórarinn Stefánsson       -- http://thorarinn.com
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils  (uses: $.inject() )

// Uses anchor href  to inject proper player for videos into articles
// Supports youtube, vimeo and videos encoded in flv or h.264+AAC MP4
// Auto calculates dimensions based on closest container width
// Usage:
//  - $('.article a.videolink').videoLinks();

(function ($) {

  var objectTempl = '<object id="video" width="%{vidwi}" height="%{vidhe}">' +
                      '<param name="movie" value="%{vidurl}"></param>' +
                      '<param name="wmode" value="transparent"></param>' +
                      '<param name="allowFullScreen" value="true"></param>' +
                      '<param name="allowscriptaccess" value="always"></param>' +
                      '<embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed>' +
                    '</object>',

      iframeTempl = '<iframe width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" scrolling="no" title="%{vidTitle}" allow="autoplay; encrypted-media" allowfullscreen></iframe>',
      videoTempl =  '<video width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" controls %{auto} controlslist="nodownload"><source src="%{vidurl}" type="video/%{mime}"></source></video>',
      blockquoteTempl = '<blockquote class="%{class}" %{attributes} style="%{styles}"><a href="%{vidurl}"></a></blockquote>',

      calcHeight = function (width, aspect4x3) {
        var vdHeight = aspect4x3 ? (width/4)*3 :
                       (width/16)*9;
        return Math.round(vdHeight);
      },

      playVideo = function (/*e*/) {
          var item = $(this),
              data = item.data('playvideo_data'),
              videoHref = data.videoHref,
              type = data.type,
              vidWidth = data.cfg.vidWidth !== 'auto' ? data.cfg.vidWidth : data.contElm.width(),
              newWidth, // used for responsive
              vidHeight = data.cfg.vidHeight !== 'auto' ? data.cfg.vidHeight : calcHeight(vidWidth, data.cfg.aspect4x3),
              videoUrl,
              videoId,
              playlistId,
              mimetype,
              autoplay = '',
              autohide = '',
              playerHeight = 0,
              vidFrame = 'iframe';

          if ( type === 'youtube' || type === 'youtu' ) {
            /*
              urls to handle:
              http://www.youtube.com/watch?v=nTasT5h0LEg&feature=topvideos
              http://www.youtube.com/embed/nTasT5h0LEg/
              http://www.youtube.com/embed/nTasT5h0LEg?rel=0
              http://www.youtube.com/embed/nTasT5h0LEg
              http://youtu.be/nTasT5h0LEg

              With playlists:
              https://www.youtube.com/watch?v=E503UT0-TC8&index=3&list=PLeM_UHGUqVy-5jM0tAWX4MeUSKIkI1G1w
              https://www.youtube.com/playlist?list=PLeM_UHGUqVy-5jM0tAWX4MeUSKIkI1G1w
              https://www.youtube.com/embed/videoseries?list=PLeM_UHGUqVy-5jM0tAWX4MeUSKIkI1G1w
              https://www.youtube.com/embed/E503UT0-TC8?list=PLeM_UHGUqVy-5jM0tAWX4MeUSKIkI1G1w
            */
            videoId = type === 'youtube' ? videoHref.match(/(?:embed\/|watch\/?\?v=)([^&?/]+)/i) : videoHref.match(/\.be\/(.+)$/);
            videoId = videoId && videoId[1];

            playlistId = videoHref.match(/[?&]list=([^&?/]+)/);
            playlistId = playlistId && 'list='+playlistId[1]+'&' || '';
            if ( playlistId && !videoId ) {
              videoId = 'videoseries';
            }

            autoplay = data.cfg.autostart ? '&autoplay=1' : '';
            autohide = data.cfg.autoHide === true ? '' : '&autohide='+ data.cfg.autoHide;
            videoUrl = docLocPC + '//www.youtube-nocookie.com/embed/' + videoId + '?'+ playlistId +'rel=0&modestbranding=1&wmode=transparent' + autoplay + autohide + data.cfg.filePlayerExtraParams;
            playerHeight = 30;
          }
          else if ( type === 'vimeo' ) {
            /*
              urls to handle:
              http://player.vimeo.com/video/3274372
              http://vimeo.com/3274372/
              http://vimeo.com/3274372?title=1
              http://vimeo.com/3274372
            */
            videoId = videoHref.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i);
            videoId = videoId && videoId[1];
            autoplay = data.cfg.autostart ? '&autoplay=1' : '';
            videoUrl = docLocPC + '//player.vimeo.com/video/'+ videoId +'?title=1&amp;byline=0&amp;portrait=0' + autoplay + data.cfg.filePlayerExtraParams;
          }
          else if ( type === 'facebook' ) {
            /*
              urls to handle:
              (new)
              https://www.facebook.com/Jolagestir/videos/10150469623167067/

              (old)
              http://www.facebook.com/v/2246424718688
              https://www.facebook.com/video/video.php?v=10150469623167067
              http://www.facebook.com/video/video.php?v=2246424718688
              http://www.facebook.com/photo/photo.php?v=2246424718688
              http://www.facebook.com/photo.php?v=2246424718688
              https://www.facebook.com/photo.php?v=2427791652748&set=vb.144567668911104&type=2&theater
            */

            if ( /\/videos\//.test(videoHref) ) {
              // matches /videos/nnnnn
              autoplay = data.cfg.autostart ? '&autoplay=true' : '';
              videoUrl = docLocPC + '//www.facebook.com/v2.6/plugins/video.php?href=' + ( encodeURIComponent(videoHref) ) + '&locale='+ data.cfg.locale +'&show_text=false'+ autoplay;
            }
            else {
              videoId = videoHref.match(/(?:\/v\/|\/videos\/|[?&]v=)(\d{10,20})/); // matches /v/nnnnn or v=nnnnn
              videoId = videoId && videoId[1];
              videoUrl = docLocPC + '//www.facebook.com/video/embed?video_id='+ videoId;
            }


          }
          else if ( type === 'instagram' ) {
            /*
              urls to handle:
              https://www.instagram.com/p/BYTlKZvhj24/
            */
            vidFrame = 'blockquote';
            videoUrl = videoHref;

            item.data('load-script', {
                scripttoken: 'instgrm',
                scripturl: '//platform.instagram.com/'+ data.cfg.locale +'/embeds.js',
                onload: 'window.instgrm.Embeds.process()',
              });
          }
          else if ( type === 'file' ) {
            var mp4v = document.createElement('video'),
                mp4Support = !!mp4v.canPlayType && mp4v.canPlayType('video/mp4').replace(/no/, ''),
                movSupport = !!mp4v.canPlayType && mp4v.canPlayType('video/quicktime').replace(/no/, '');
            if ( mp4Support && /\.(mp4|m4v)(\?|$)/i.test( videoHref ) ) {
              videoUrl = videoHref;
              vidFrame = 'video';
              autoplay = data.cfg.autostart ? 'autoplay' : '';
              mimetype = 'mp4';
            }
            else if ( movSupport && /\.mov(\?|$)/i.test( videoHref ) ) {
              videoUrl = videoHref;
              vidFrame = 'video';
              autoplay = data.cfg.autostart ? 'autoplay' : '';
              mimetype = 'quicktime';
            }
            else {
              autoplay = data.cfg.autostart ? '&autostart=true' : '';
              videoUrl = data.cfg.filePlayerUrl + videoHref + autoplay + data.cfg.filePlayerExtraParams;
              vidFrame = data.cfg.filePlayerFrame;
              vidHeight = vidHeight + data.cfg.filePlayerHeight; //add player height to video height
            }
          }
          else {
            // Everything else
            videoUrl = videoHref;
          }



          if (vidFrame === 'iframe') {
            item.html($.inject(iframeTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight,
                          vidTitle: data.vidCapt,
                        }));
          }
          else if (vidFrame === 'video') {
            item.html($.inject(videoTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight,
                          auto   : autoplay,
                          mime   : mimetype,
                        }));
          }
          else if (vidFrame === 'blockquote') {
            // instagram depends on small set of inline styles to make it look nice.
            // data-instgrm-captioned is optional in the embed code, maybe it should be optional here too?
            item.html($.inject(blockquoteTempl, {
                          vidurl : videoUrl,
                          class: 'instagram-media',
                          attributes  : 'data-instgrm-captioned data-instgrm-version="7"',
                          styles  : 'margin:1px;padding:0;border:0;max-width:658px;width:calc(100% - 2px);',
                        }));
          }
          else if (vidFrame === 'flash') {
            item.html($.inject(objectTempl, {
                          vidurl : videoUrl,
                          vidwi  : vidWidth,
                          vidhe  : vidHeight,
                        }));
          }

          if (data.cfg.useCaption && data.vidCapt.length > 0 && vidFrame !== 'instagram') {
            item.append('<span class="videocaption">'+  data.vidCapt +'</span>');
          }

          if (vidFrame !== 'flash' && type !== 'instagram' && data.cfg.vidWidth === 'auto') {
            $(window).on('resize.videolinks', function (/*e*/) {
                newWidth = data.contElm.width();
                if (newWidth !== vidWidth) {
                  vidWidth = newWidth;
                  vidWidth = data.contElm.width();
                  vidHeight = calcHeight(vidWidth, data.cfg.aspect4x3) + playerHeight;
                  item.find('iframe,video').attr('height',vidHeight).attr('width',vidWidth);
                }
              });
          }

          var scriptData = item.data('load-script');
          if ( scriptData ) {
            setTimeout(function () {
              if ( !window[scriptData.scripttoken] ) {
                var scriptTag = document.createElement('script');
                scriptTag.async = true;
                scriptTag.defer = true;
                scriptTag.src = scriptData.scripturl;
                scriptTag.onload = scriptData.onload;
                $('head').append(scriptTag);
              }
              else {
                var loadScript = new Function(scriptData.onload);
                loadScript.apply(null);
              }
            }, 10);
          }

      }, // end fn
      docLocPC = document.location.protocol;
  docLocPC = docLocPC === 'file:' ? 'http:' : docLocPC;

  $.fn.videoLinks = function ( cfg ) {
    var videoLinks = this;

    if (videoLinks.length) {
      cfg = $.extend({
              autostart: false,
              vidWidth:  'auto', //integer or 'auto' ()
              vidHeight: 'auto',
              aspect4x3:  false,
              useCaption: true, // append video caption
              type: null, // overwrite default type
              autoHide: true, // autohide player controls - only active for youtube now. - https://developers.google.com/youtube/player_parameters#autohide
              locale: 'en_US', // 5 character local code

              filePlayerUrl: '/bitar/common/media/mediaplayer.swf?file=',
              filePlayerExtraParams: '',
              filePlayerHeight: 20,
              filePlayerFrame: 'flash',
            }, cfg );
    }
    return videoLinks.map(function () {
        var link = $(this),
            videoHref = link.attr('href'),
            type =  cfg.type ||
                    (/\.youtube\.com/i.test( videoHref ) && 'youtube') ||
                    (/youtu\.be/i.test( videoHref ) && 'youtu') ||
                    (/vimeo\.com/i.test( videoHref ) && 'vimeo') ||
                    (/facebook\.com/i.test( videoHref ) && 'facebook') ||
                    (/instagram\.com/i.test( videoHref ) && 'instagram') ||
                    (/\.(flv|mp4|m4v|mov)(\?|$)/i.test( videoHref ) && 'file') ||
                    undefined,
            data = {
                cfg:         cfg,
                videoHref:   videoHref,
                type:        type,
                vidCapt:     link.text().trim(),
              },
            wrapper = link.wrap('<span class="videoblock" />').parent();

        data.contElm = $(wrapper);
        while ( data.contElm[0]  &&  data.contElm.css('display')==='inline' ) {
          data.contElm = $(data.contElm.parent());
        }

        wrapper
            .data( 'playvideo_data', data )
            .run(playVideo);

        link.remove();

        return wrapper[0];

      });
  };

})(jQuery);
