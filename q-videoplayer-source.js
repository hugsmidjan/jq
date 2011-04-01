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

      playVideo = function(e, firstrun) {
          var item = $(this),
              cfg = item.data('playvideo_cfg'),
              data = item.data('playvideo_data'),
              currentClass = cfg.currentClass,
              videoHref = data.videoHref,
              type = data.type,
              videoUrl,
              autoplay,
              vidFinHeight;

          cfg.setfragment  &&  !firstrun  &&  $.setFrag(videoHref.replace(/^(https?:)?\/\//i, ''));

          $('#video').remove();
          $( videoTempl.data('videoopener') ).removeClass( currentClass );
          item.addClass( currentClass );
          videoTempl.data( 'videoopener', item );

          //youtube suppor.data('playvideo_data')t
          if ( type == 'youtube' )
          {
            autoplay = cfg.autostart == 'all' ? autoplay = '&autoplay=1' :
                       cfg.autostart == 'none' ? autoplay = '' :
                       firstrun ? '' : '&autoplay=1';

            videoUrl = 'http://www.youtube.com/v/' + data.youtubeId + '&hl=en_US&fs=1&rel=0' + autoplay;
            vidFinHeight = cfg.vidHeight + 25;
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
            var vimeoId = videoHref.replace('http://vimeo.com/','');

            autoplay = cfg.autostart == 'all' ? autoplay = '&autoplay=1' :
                       cfg.autostart == 'none' ? autoplay = '' :
                       firstrun ? '' : '&autoplay=1';

            videoUrl = 'http://vimeo.com/moogaloop.swf?clip_id='+ vimeoId +'&server=vimeo.com&show_portrait=0&fullscreen=1' + autoplay;
            vidFinHeight = cfg.vidHeight;
          }

          videoTempl.find('.videocontainer')
              .html(
                  $.inject(objectTempl, {
                        vidurl : videoUrl,
                        vidwi  : cfg.vidWidth,
                        vidhe  : vidFinHeight
                      })
                );
          videoTempl.find('h2')
              .text( item.find('h3 a').text() );
          videoTempl.find('.summary')
              .text( item.find('.summary').text() );

          e.preventDefault();
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
              autostart: 'notfirst', //all, notfirst, none
              youtubeImg: 1, //true, 1, false, 0, large (preview image from youtube. large for larger image)
              defaultImg: 0 //path to default image for mediaplayer (only for 'file')
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

      $( link[0]  ||  videolist.filter(':visible').find('.item')[0] )
          .trigger( 'click', true );
    };

    return videolist;
  };

})(jQuery);