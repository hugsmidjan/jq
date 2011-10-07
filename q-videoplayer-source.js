// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.videoList v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
//   * Már Örlygsson             -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils  (uses: $.inject(), $.beget() )

// Finds all items in articlelist and generates appropriate player according to the video url
// Requires the usage of "tivísunarslóð" for each article to point to the correct video
// Supports youtube, vimeo and videos encoded in flv or h.264+AAC MP4
// Usage:
//  - $('.videolist').videoList();

(function($){

  var videoTempl = $('<div id="videobox" class="videobox box">' +
                        '<span class="videocontainer" />' +
                        '<h2/>' +
                        '<div class="summary"/>' +
                      '</div>'),
      objectTempl = '<object id="video" width="%{vidwi}" height="%{vidhe}">' +
                      '<param name="movie" value="%{vidurl}"></param>' +
                      '<param name="wmode" value="transparent"></param>' +
                      '<param name="allowFullScreen" value="true"></param>' +
                      '<param name="allowscriptaccess" value="always"></param>' +
                      '<embed src="%{vidurl}" type="application/x-shockwave-flash" wmode="transparent" allowscriptaccess="always" allowfullscreen="true" width="%{vidwi}" height="%{vidhe}"></embed>' +
                    '</object>',

      iframeTempl = '<iframe title="YouTube video player" width="%{vidwi}" height="%{vidhe}" src="%{vidurl}" frameborder="0" allowfullscreen></iframe>',

      docLocPC = document.location.protocol,
      docLocPC = docLocPC == 'file:' ? 'http:' : docLocPC,

      playVideo = function(e, firstrun) {
          var item = $(this),
              cfg = item.data('playvideo_cfg'),
              data = item.data('playvideo_data'),
              currentClass = cfg.currentClass,
              videoHref = data.videoHref,
              type = data.type,
              videoUrl,
              autoplay,
              useIframe = false,
              vidFinHeight;

          cfg.setfragment  &&  !firstrun  &&  $.setFrag(videoHref.replace(/^(https?:)?\/\//i, ''));

          if (type.length)
          {
            $('#video').remove();
            $( videoTempl.data('videoopener') ).removeClass( currentClass );
            item.addClass( currentClass );
            videoTempl.data( 'videoopener', item );

            //youtube suppor.data('playvideo_data')t
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
              var youtubeId = type == 'youtube' ? videoHref.match(/(?:embed\/|watch\/?\?v=)([^&?\/]+)/i)[1] : videoHref.match(/\/([0-9a-z]+)$/i)[1];

              autoplay = cfg.autostart == 'all' ? autoplay = '&autoplay=1' :
                         cfg.autostart == 'none' ? autoplay = '' :
                         firstrun ? '' : '&autoplay=1';

              videoUrl = docLocPC + '//www.youtube.com/embed/' + youtubeId + '?rel=0' + autoplay;
              vidFinHeight = cfg.vidHeight + 30; //add player height to video height
              useIframe = true;
            }
            else if ( type == 'file' )
            {
              autoplay = cfg.autostart == 'all' ? autoplay = '&autostart=true' :
                         cfg.autostart == 'none' ? autoplay = '' :
                         firstrun ? '' : '&autostart=true';

              var playerImgUrl = cfg.defaultImg ? '&image=' + cfg.defaultImg : '';
              videoUrl = '/bitar/common/media/mediaplayer.swf?file=' + videoHref + playerImgUrl + autoplay;
              vidFinHeight = cfg.vidHeight + 20;
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
              var videoId = videoHref.match(/\/([0-9a-z]{5,10})\/?(?:[#?]|$)/i)[1];

              autoplay = cfg.autostart == 'all' ? autoplay = '&autoplay=1' :
                         cfg.autostart == 'none' ? autoplay = '' :
                         firstrun ? '' : '&autoplay=1';

              videoUrl = docLocPC + '//player.vimeo.com/video/'+ videoId +'?title=1&amp;byline=0&amp;portrait=0' + autoplay;
              vidFinHeight = cfg.vidHeight;
              useIframe = true;
            }
            else if ( type == 'facebook' )
            {
              /*
                urls to handle:
                http://www.facebook.com/v/2246424718688
                http://www.facebook.com/video/video.php?v=2246424718688
              */
              var videoId = videoHref.match(/(\d{10,15})$/)[1];
              videoUrl = docLocPC + '//www.facebook.com/v/'+ videoId;
            }
            if (useIframe)
            {
              videoTempl.find('.videocontainer')
                      .html($.inject(iframeTempl, {
                          vidurl : videoUrl,
                          vidwi  : cfg.vidWidth,
                          vidhe  : vidFinHeight
                        }))
            } 
            else 
            {
              videoTempl.find('.videocontainer')
                      .html($.inject(objectTempl, {
                          vidurl : videoUrl,
                          vidwi  : cfg.vidWidth,
                          vidhe  : vidFinHeight
                        }))
            }

            videoTempl.find('h2')
                .text( item.find('h3 a').text() );
            videoTempl.find('.summary')
                .text( item.find('.summary').text() );

            e.preventDefault();
          }
        }; // end fn


  $.fn.videoList = function ( cfg ) {
    var videolist = this;

    if (videolist.length)
    {
      cfg = $.extend({
              vidWidth : 684,
              vidHeight :414,
              //thumbnails: false,
              //setfragment: false,
              currentClass: 'current',
              autostart: 'notfirst', //autoplay videos, (supports: all, notfirst, none)
              youtubeImg: 1, //true, 1, false, 0, large (preview image from youtube. large for larger image)
              defaultImg: 0, //path to default image for mediaplayer (only for 'file')
              startOpen:  1  //inject player on load
            }, cfg );

      videoTempl.insertBefore( videolist.eq(0) );

      videolist.find('.item')
          .data('playvideo_cfg', cfg)
          .bind('click', playVideo)
          .each(function () {
              var item = $(this),
                  videoHref = item.find('a').attr('href'),
                  type =  (/\.youtube\.com/i.test( videoHref ) && 'youtube') ||
                          (/\.(flv|mp4|m4v)(\?|$)/i.test( videoHref ) && 'file') ||
                          (/vimeo\.com/i.test( videoHref ) && 'vimeo') ||
                          (/youtu\.be/i.test( videoHref ) && 'youtu') ||
                          (/facebook\.com/i.test( videoHref ) && 'facebook') ||
                          '',
                  data = {
                      videoHref: videoHref,
                      type:      type
                    };

              item.data( 'playvideo_data', data );

              if ( cfg.youtubeImg && type == 'youtube' )
              {
                data.youtubeId = videoHref.split('?')[1].match(/v=([^&]+)/)[1];
                if ( cfg.thumbnails )
                {
                  var rand = Math.floor(Math.random()*3+1),
                      imgSize = cfg.youtubeImg == 'large' ? '0' : 'default',
                      thumbUrl = 'http://i'+ rand +'.ytimg.com/vi/'+ data.youtubeId +'/'+ imgSize +'.jpg';
                  if ( thumbUrl )
                  {
                    item.find('img')
                        .attr( 'src', thumbUrl );
                  }
                }
              }
            });

      var fragm = $.getFrag(),
          link = fragm  &&  videolist.find('a[href$="'+fragm+'"]');

      if (cfg.startOpen)
      {
        $( link[0]  ||  videolist.filter(':visible').find('.item')[0] )
            .trigger( 'click', true );
      }

    };

    return videolist;
  };

})(jQuery);