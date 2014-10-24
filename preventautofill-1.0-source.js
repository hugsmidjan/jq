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

      // Temporarily make password fields readonly to prevent browsers
      // from auto-filling the field on-load
      var pwFields = forms.find('input:password')
                        .prop('readOnly', true);
      var noFieldHasReceivedFocus = true;
      // When non-password (text) fields have focus
      // make password-fields readOnly meanwhile - to prevent browsers from autofilling on input.
      forms.find('input:not(:password)')
          .on('focusin focusout', function(e){
              noFieldHasReceivedFocus = false; // flag that some non-password field has received Focus (makes the readOnly state sticky)
              pwFields.prop('readOnly', e.type==='focusin');
            });

      // Empty autofilled inputs with previously saved passwords
      // in case the browser has already filled them in (IE is very quick, for example)
      forms.find('input:not(:button,:submit,:reset,:checkbox,:radio)')
          // that don't have a value set on the server-side
          .not(function () {  return !!$(this).attr('value');  })
              // and empty them.
              .val('');

      // reset password-fields' readOnly state if noFieldHasReceivedFocus
      setTimeout(function() {
          noFieldHasReceivedFocus  &&  pwFields.prop('readOnly', false);
        }, 100);

      return this;
    };


})(jQuery);


