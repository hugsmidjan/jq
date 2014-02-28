// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4+

// ajax submits all normal forms and displays the response in the form box
// Usage:
//  - $('form').ajaxForm();

(function($){

  $.fn.ajaxForm = function () {
    return this.submit(function(e) {

        if (!e.isDefaultPrevented())
        {
          var theForm = $(this).trigger('beforeSubmit'),
              method = theForm.attr('method') || 'post';

          $('body').addClass('ajax-wait');
          $[method.toLowerCase()](
                theForm.attr('action'),
                theForm.serialize() + '&justPicPos=pgmain'
              )
            .done(function(response) {
                var responseText = $(response).find('.pgmain .boxbody:first');
                if (theForm.find('.boxbody').length)
                {
                  theForm.find('.boxbody').html(responseText.html());
                }
                else
                {
                  theForm.html(responseText.html());
                }
                theForm
                    .addClass('submitted')
                    .trigger('afterSubmit');
              })
            .always(function() {
                $('body').removeClass('ajax-wait');
              });
          return false;
        }
      });
  };

})(jQuery);