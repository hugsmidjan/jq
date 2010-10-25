// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.delayedHighlight v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  Highlights list items on mouseenter/focusin after a specified delay (and instantly when clicked)
  Highlight is sticky - and lasts until another item is highligthed (or the current item is clicked again)
  
  TODO:
    * add a (default on) 'sticky' option to allow non-sticky highlights
*/
(function($){

  var runCount = 0,
      ts = '.dh'+(new Date()).getTime() +'-';

  $.fn.delayedHighlight = function (cfg) {
      cfg = $.extend({
            //delegate:    'li',
            //className:   'focused',
            //delay:       500,
            //cancelOff:   'a, area, :input'
          },
          cfg
        );
      var list = this,
          dataSuffix = ts+(runCount++);
          className =  cfg.className || 'focused',
          delegate =   cfg.delegate || 'li',
          evPrefix =   'highlight';

      list
          .bind( evPrefix+'on '+evPrefix+'off', false )
          .delegate(delegate, 'mouseleave focusout', function (e) {
              clearTimeout( list.data('timeout'+dataSuffix) );
            })
          .delegate(delegate, 'mouseenter focusin click', function (e) {
              var item = $(this),
                  isClick =  e.type == 'click';
              if ( !isClick ||  !(item[0]==(list.data( 'item'+dataSuffix )||[])[0]  &&  $(e.target).closest(cfg.cancelOff||'a, area, :input', this)[0]) )
              {
                list.data('timeout'+dataSuffix,
                    setTimeout(
                        function(){
                            var activeItem = list.data( 'item'+dataSuffix ),
                                remove;
                            if ( activeItem[0] != item[0]  ||  isClick )
                            {
                              className  &&  activeItem.removeClass( className );
                              activeItem.trigger( evPrefix+'off' );
                              remove = true;
                            }
                            if ( !isClick  ||  activeItem[0] != item[0] )
                            {
                              className && item.addClass( className );
                              item.trigger( evPrefix+'on' );
                              list.data( 'item'+dataSuffix, item );
                              remove = false;
                            }
                            remove  &&  list.removeData( 'item'+dataSuffix );
                          },
                        isClick? 0 : cfg.delay||500
                      );
                  );
              }
            });

      return this;
    };

})(jQuery);
