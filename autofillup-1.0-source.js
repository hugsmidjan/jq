// ----------------------------------------------------------------------------------
// jQuery.fn.autoFillup v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// Attempts to auto-fill dynamically generated login forms
// that Firefox and Chrome normally don't auto-fill
//
(function($){

  $.fn.autoFillup = function () {
      var ua = navigator.userAgent,
          msie = !!/(MSIE) ([\w.]+)/.test(ua),
          opera = /(Opera)(?:.*version|)[ \/]([\w.]+)/.test(ua),
          domify = $.parseHTML || $;
      if (!msie && !opera) // no need for this in MSIE (at least version 9). Yay for microsoft!
      {
        this.find('form').add( this.filter('form') )
            .each(function () {
                var form = $(this),
                    emptyFields = form.find('input')
                                      // just text inputs and password inputs. (note :text wouldn't match type="email", for instance)
                                      .not(':submit,:button,:reset,:checkbox,:radio,[type="hidden"]')
                                      // only include empty fields.
                                      .filter(function(){ return !this.value; }),
                    iframeHTML = '';
                if ( emptyFields[0] )
                {
                  emptyFields.each(function (i, field) {
                      iframeHTML += '<input name="'+ field.name +'" type="'+ field.type +'"/>';
                    });
                  //var iframe = $(domify('<iframe style="position:fixed;top:0;"/>')).appendTo('body'),
                  var iframe = $(domify('<iframe style="width:0;height:0;position:fixed;"/>')).appendTo('body'),
                      idoc = iframe.contents()[0];
                  idoc.write( '<form action="'+ form[0].action +'">'+iframeHTML+'</form>' );
                  idoc.close();
                  setTimeout(function(){
                      $(idoc).find('input')
                          .each(function (i) {
                              var orgField = emptyFields[i];
                              orgField.value  ||  (orgField.value = this.value);
                            });
                      iframe.remove();
                    }, 100); // some delay seems neccessary...
                }
              });
      }
      return this;
    };

})(jQuery);