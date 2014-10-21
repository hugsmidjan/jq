/* jQuery.fn.preventAutofill 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// Forcefully Prevent Browsers from auto-filling and saving password field values   v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------


(function($){


  $.fn.preventAutofill = function () {
      var forms = this;
      // prevent save-password prompting
      forms
          // NOTE: this should run *after* any form-validation routines.
          .attr('autocomplete', 'off')
          .on('submit', function (e) {
              if ( !e.isDefaultPrevented() )
              {
                // find all :enabled password fields
                $(this).find('input:password:enabled')
                    .each(function () {
                        var pwField = $(this);
                        var pw = pwField.val();
                        // Insert a hidden field with the same name and value
                        var hiddenField = $('<input type="hidden"/>');
                        hiddenField
                            .attr( 'name', pwField.attr('name') )
                            .val( pw )
                            .insertBefore( pwField );
                        // empty and disable the password field
                        pwField
                            .val('')
                            .prop('disabled', true);
                        // then after a while reenable the password field and remove the hidden field.
                        setTimeout(function(){
                            hiddenField
                                .detach();
                            pwField
                                .val( pw )
                                .prop('disabled', false);
                          }, 100);
                      });

              }
            });

      // Toggle readOnly state of password fields on focus/blur to prevent
      // browsers auto-filling the password during typing into the username field.
      forms.find('input:password')
          .prop('readOnly', true)
          .on('focusin focusout', function(e){ this.readOnly = e.type === 'focusout';  console.log(this.readOnly) });

      // Empty autofilled inputs with previously saved passwords.
//      setTimeout(function(){
          // (setTimeout to allow browser chance to autofill
          // find all password/text fields
          forms.find('input:not(:button,:submit,:reset,:checkbox,:radio)')
              // that don't have a value set on the server-side
              .not(function () {  return !!$(this).attr('value');  })
                  // and empty them.
                  .val('');
//        }, 50);


      return this;
    };


})(jQuery);


