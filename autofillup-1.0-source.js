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
      if (!$.browser.msie) // no need for this in MSIE (at least version 9). Yay for microsoft!
      {
        var form = this.find('form').andSelf().filter('form'),
            emptyFields = form.find('input')
                              // just text inputs and password inputs. (note :text wouldn't match type="email", for instance)
                              .not(':submit,:button,:reset,:checkbox,:radio,[type="hidden"]')
                              // only include empty fields.
                              .filter(function(){ return !this.value; }),
            iframeHTML = '';
        emptyFields.each(function (i, field) {
            iframeHTML += '<input name="'+ field.name +'" type="'+ field.type +'"/>';
          });
        //var iframe = jQuery('<iframe/>').appendTo('body'),
        var iframe = jQuery('<iframe style="width:0;height:0;position:fixed;visibility:hidden;"/>').appendTo('body'),
            idoc = iframe.contents()[0];
        idoc.write( '<form>'+iframeHTML+'</form>' );
        idoc.close();
        setTimeout(function(){
            $(idoc).find('input')
                .each(function (i) {
                    var orgField = emptyFields[i];
                    orgField.value  ||  (orgField.value = this.value);
                  });
            iframe.remove();
          }, 0);
      }
      return this;
    };

})(jQuery);