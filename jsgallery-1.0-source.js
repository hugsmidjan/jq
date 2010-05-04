// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.jsgallery v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.3, 
//  - imgpopper

//  - Demo: http://www.portusgroup.is/eigendur/markadsmal/thrividdarmyndir/
//  - usage: $('.mediagallery .boxbody ul.thumbsview').jsgallery({ cfg })

(function($){

  $.fn.jsgallery = function ( cfg ) {

    var i18n = {
      en: {
          nextText:      'Next image',
          prevText:      'Previous image',
          imgText:       'Image',
          ofText:        'of'
        },
      is: {
          nextText:      'Næsta mynd',
          prevText:      'Fyrri mynd',
          imgText:       'Mynd',
          ofText:        'af'
        }
    };

    cfg = $.extend({
            fadeInSpeed: 150,        // set 0 for no animation
            curtColor: '#000000',    // popup curtain color
            curtOpacity: '0.7',      // popup curtain opacity
            smallImgSize: 'preview', // media library subfolder for display images
            medImgSize: 'medium',    // media library subfolder for display images
            largeImgSize: 'large',   // media library subfolder for popup images
            showTitles: true,        // display image title/alt tags below images
            paging: true,            // show pagination
            loop: true               // loops the navigation
          }, cfg );

    var gallery = $(this),
        txt = txt || i18n[ gallery.closest('[lang]').attr('lang') ]  ||  i18n.en,
        imgLinks = $('li a', gallery),
        idxLength = imgLinks.length,
        currentIdx = 0,
        newIdx = 0,
        imgTemplate = $('<div class="imgbox">' +
                          '<div class="img">' +
                            '<a href="">' +
                              '<img src="" title="" alt="" />' +
                            '</a>' +
                          '</div>' +
                          '<div class="imgcontent">' +
                            '<div class="imgname"></div>' +
                            '<div class="imgtext"></div>' +
                          '</div>' +
                        '</div>'),

        updateImg = function() {
          var newImg = imgLinks[newIdx],
              popHref = newImg.href.replace('/'+ cfg.medImgSize +'/', '/'+ cfg.largeImgSize +'/'),
              titleTxt = $('img', newImg)[0].title || '',
              altTxt = $('img', newImg)[0].alt || '';

          $('div.img', imgTemplate)
              .find('> a')
                  .hide()
                  .attr('href', popHref)
                  .find('> img')
                      .attr('src', newImg)
                      .attr('title', titleTxt)
                      .attr('alt', altTxt)
                  .end()
                  .fadeIn(cfg.fadeInSpeed);

          if (cfg.showTitles)
          {
            $('div.imgname', imgTemplate).html( titleTxt );
            $('div.imgtext', imgTemplate).html( altTxt );
          }
          
          if (cfg.paging) { 
            $('.status b', imgTemplate).html( newIdx+1 ) ;
          }
          
          $(imgLinks[currentIdx]).parent().removeClass('current');
          $(imgLinks[newIdx]).parent().addClass('current');
          
          currentIdx = newIdx;
          
        },

        nextImg = function() {
          if (newIdx != idxLength-1)
          {
            newIdx++;
            updateImg();
          }
          else if ( cfg.loop && newIdx == idxLength-1 )
          {
            newIdx = 0;
            updateImg();
          }
        },

        prevImg = function() {
          if (newIdx !== 0)
          {
            newIdx--;
            updateImg();
          }
          else if ( cfg.loop && newIdx === 0 )
          {
            newIdx = idxLength-1;
            updateImg();
          }
        };

    //change urls for imagelist and assign events
    imgLinks.each(function(i) {
        $(this)
            .attr('href', $('img', this)[0].src.replace('/'+ cfg.smallImgSize +'/', '/'+ cfg.medImgSize +'/') )
            .bind('click', function() {
                newIdx = i-1;
                nextImg();
                return false;
              });
      });

    //paging controls
    if (cfg.paging) {
      $('<div class="paging">' +
          '<div class="status">' +
            '<strong>'+ txt.imgText +'</strong> ' +
            '<span><b>1</b> '+ txt.ofText +' '+ idxLength +'</span>' +
          '</div>' +
          '<ul class="stepper">' +
            '<li class="next"><a href="#" title="'+ txt.nextText +'">'+ txt.nextText +'</a></li>' +
            '<li class="prev"><a href="#" title="'+ txt.prevText +'">'+ txt.prevText +'</a></li>' +
          '</ul>' +
        '</div>')
                .appendTo(imgTemplate)
                .find('.next a').bind('click', function() { nextImg(); return false; }).end()
                .find('.prev a').bind('click', function() { prevImg(); return false; });
    }
    
    //show first image
    updateImg();
    imgTemplate
        .insertBefore(gallery)
        .find('div.img > a')
            .imgPopper({ 
                curtainColor: cfg.curtColor,
                curtainOpacity: cfg.curtOpacity
              });
      

    //keyboard navigation
    $(document).bind('keyup', function(e) {
        if( e.keyCode == 37 ) {
            prevImg();
        }
        if( e.keyCode == 39 ) {
            nextImg();
        }
      });

    return this;
  };

})(jQuery);