// ----------------------------------------------------------------------------------
// jQuery.uniquifyIds v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// ensures that a detached DOM fragment doesn't contain any elements with non-unique id="" values
// and auto-appends a integer value on such id's to make them unique.
// Also fixes label[for] and img[usemap] attributes.
//
(function($){

  $.fn.uniquifyIds = function ($) {
      return this
                  .each(function () {
                      var container = $(this);
                      container.find('*').andSelf().filter('[id]')
                          .each(function () {
                              var orgId = this.id,
                                  newId = $.aquireId( orgId ),
                                  elm = $(this).attr( 'id', newId );
                              $.each(
                                  {
                                    'input, select, textarea': 'label[for',
                                    'area':                    'img[usemap'
                                  },
                                  function (elmType, selector) {
                                      if ( elm.is(elmType) )
                                      {
                                        container.find(selector+'="'+ orgId +'"]')
                                            .attr( selector.split('[')[1], newId );
                                      }
                                    }
                                );
                            });
                    });
    };

})(jQuery);
