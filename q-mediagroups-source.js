// ----------------------------------------------------------------------------------
// jQuery.fn.mediaGroups v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Sena.is specific script!

// Requires: videolinks, listscroller, equalizeHeights

(function($){

  $.fn.mediaGroups = function ( cfg ) {

    cfg = $.extend({
            }, cfg );

    return this.each(function(){
        var groups = $(this).find('.group');

        groups.each(function (i) {
            var firstDiv =  $(this).find('> div:first'),
                linkHref = $(this).find('a:first').attr('href'),
                iframeSrc = $(this).find('iframe:first').attr('src'),
                type =  (firstDiv.is('.twitter-wrap') && 'twitter')
                        || (/(?:\/\/|\.)(?:youtube\.com|youtu\.be)/i.test( linkHref ) && 'youtube')
                        || (/(?:\/\/|\.)vimeo\.com/i.test( linkHref ) && 'video vimeo')
                        || (/(?:\/\/|\.)twitter\.com/i.test( linkHref ) && 'twitter')
                        || (/\.(flv|mp4|m4v)(\?|$)/i.test( linkHref ) && 'video file')
                        || (/(?:\/\/|\.)facebook\.com/i.test( linkHref ) && 'facebook')
                        || (/(?:\/\/|\.)flickr\.com/i.test( linkHref ) && 'images flickr')
                        || (/(?:\/\/|\.)spotify\.com/i.test( iframeSrc ) && 'spotify')
                        || (/\.(jpe?g|png|gif)(\?|$)/i.test( linkHref ) && 'images file')
                        || 'links';

            if (type == 'youtube')
            {
              type = /user|channel/.test(linkHref) ? 'links youtube' :
                     'video youtube';
            }
            else if (type == 'facebook')
            {
              type = /type=2/.test(linkHref) ? 'video facebook' :
                     /type=3/.test(linkHref) ? 'images facebook' :
                     'links facebook';
            }

            $(this).addClass(type);


            if      ( /links/.test(type) )    { $(this).prepend('<h3>Tenglar</h3>'); }
            else if ( /youtube/.test(type) )  { $(this).prepend('<h3>YouTube</h3>'); }
            else if ( /vimeo/.test(type) )    { $(this).prepend('<h3>Vimeo</h3>'); }
            else if ( /video/.test(type) )    { $(this).prepend('<h3>Myndbönd</h3>'); }
            else if ( /twitter/.test(type) )  { $(this).prepend('<h3>Twitter</h3>'); }
            else if ( /facebook/.test(type) ) { $(this).prepend('<h3>Facebook</h3>'); }
            else if ( /flickr/.test(type) )   { $(this).prepend('<h3>Flickr</h3>'); }
            else if ( /spotify/.test(type) )   { $(this).prepend('<h3>Spotify</h3>'); }
            else if ( /images/.test(type) )   { $(this).prepend('<h3>Myndir</h3>'); }
          });

        groups.filter('.video').Req(
            'q-videolinks',
            function() {
              $(this).each(function () {
                  $(this).find('a').videoLinks();
                  if ( $(this).find('li').length > 1 )
                  {
                    $(this).listscroller({
                        item            : 'li',
                        paging          : true,
                        statusPager     : false,
                        jumpPager       : true,
                        aspect          : 'horizontal',
                        animation       : 'carousel',
                        wrap            : 'both',
                        speed           : 400,
                        windowSize      : 1,
                        stepSize        : 1
                      });
                  }
                });
            }
          );

        groups.filter('.links').find('a').attr('target','_blank');

        groups.filter('.flickr').each(function () {
            var ul = $(this).find('ul'),
                lis = ul.find('li'),
                i=0,
                l=lis.length;
            for (i=0; i<l; i+=9)
            {
              $('<ul />').append(lis.slice(i,i+9)).appendTo($(this));
            }
            ul.remove();

            if ( $(this).find('ul').length > 1 )
            {
              $(this).listscroller({
                  item            : 'ul',
                  paging          : true,
                  statusPager     : false,
                  jumpPager       : true,
                  aspect          : 'horizontal',
                  animation       : 'carousel',
                  wrap            : 'loop',
                  speed           : 400,
                  windowSize      : 1,
                  stepSize        : 1
                });
            }
          });

        groups.filter('.twitter').each(function () {
            $(this).find('a').attr('target','_blank');

            if ( $(this).find('.twitter-wrap').length > 1 )
            {
              $(this).listscroller({
                  item            : '.twitter-wrap',
                  paging          : true,
                  statusPager     : false,
                  jumpPager       : true,
                  aspect          : 'horizontal',
                  animation       : 'carousel',
                  wrap            : 'loop',
                  speed           : 400,
                  windowSize      : 1,
                  stepSize        : 1
                });
            }
          });

        // þurfum að finna .group aftur eftir að búið er að remove'a ^
        $(this).addClass('gpc-'+ $(this).find('.group').length);

        if (groups.length > 1)
        {
          groups.Req(
            'equalizeheights',
            function() {
              $(this).equalizeHeights();
            }
          );
        }
      });
  };

})(jQuery);