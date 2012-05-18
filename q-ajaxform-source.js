// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.imgPopper v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4

// ajax submits all normal forms and displays the response in the form box
// Usage:
//  - $('form').ajaxForm();

(function($){

  $.fn.ajaxForm = function ( cfg ) {
    cfg = $.extend({
              afterSubmit: function () {}
            }, cfg );
    this.submit(function(e) {

        if (!e.isDefaultPrevented()) {
          var theForm = $(this);
              $.get(
                  theForm.attr('action'),
                  theForm.serialize(),
                  function(response){
                    var responseText = $(response).find('.pgmain .boxbody:first');
                    if (theForm.is('.boxbody')) {
                      theForm.html(responseText.html());
                    } else {
                      theForm.find('.boxbody').html(responseText.html());
                    }
                    theForm.addClass('submitted');
                    if ( $.isFunction( cfg.afterSubmit ) )
                    {
                      cfg.afterSubmit;
                    }
                  }
                );
          return false;
        }
      });

    return this;
  };

})(jQuery);