// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.labelizor v 1.1
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// Requires jQuery 1.4+

(function ($) {
  var labelizor = 'labelizor',
       labelizorlabel = labelizor+'label';

  $.fn[labelizor] = function ( cfg, b ) {

   var a = cfg && cfg.charAt ? cfg : '',    // <-- also support the old `$(':input').labelizor(hideClass, blurClass)` syntax
 
      cfg = $.extend({
          lRe:         /(\*|:[\W\S]*$)/g,     // pattern used to clean the <label> text.
          //lPlace:      '',                    // replacement text/pattern for cfg.lRe
          //labelFilter: null,                  // label sub-selector  (may also be a function - see below)
          //labelFilter: function(label, input){ return label.find('i').text() || input.title || label.text(); },
          //labelText:   'My custom label text' // this text trumps all other texts...

          //preferTitle: false,                 // true makes .labelizor favour input's title="" over its <label/>
          //condHide:    false,                 // true causes <label> to only be hidden when it's text is used.
          useLabel:     true,                   // false makes the script completely ignore the label element for any purposes.

          blurClass:    b||'labelized',
          hideClass:    a||'stream'
        },
        !a&&cfg),

        hasPlaceholderSupport = 'placeholder' in  $('<input/>')[0],
        _hideClass   = cfg.hideClass,
        _blurClass   = cfg.blurClass,
        _labelFilter = cfg.labelFilter,
        _useLabel    = cfg.useLabel,
        _showPlaceholder = function (e) {
            var field = $(this),
                val = field.val(),
                llabel = field.data( labelizorlabel ),
                labelize = !val  ||  (e==labelizor && val==llabel);
            if ( labelize )
            {
              field
                  .val( llabel );
            }
            field
                .toggleClass(_blurClass, labelize);
          },
        _hidePlaceholder = function (e) {
            var field = $(this),
                val = field.val();
            if ( !val  ||  (field.is('.'+_blurClass) && val==field.data( labelizorlabel )) )
            {
              field
                  .val('')
                  .removeClass(_blurClass);
            }
          },
        _hideAllPlaceholders = function (e) {
            $(this).find('.'+_blurClass)
                .filter(function () {
                    var input = $(this),
                        llabel = input.data(labelizorlabel);
                    return llabel  &&  input.val()==llabel;
                  })
                    .val('');
          };

    this.filter(':text, :password, textarea')
        .each(function(){
            var fieldElm = this,
                field = $(fieldElm),
                form = $(fieldElm.form);
            if ( !field.data(labelizor) ) // avoid processing the same input more than once.
            {
              var _placeholder = field.attr('placeholder'),
                  _labelText = cfg.labelText || _placeholder, // cfg.labelText trumps all other texts...
                  _inpTitle = fieldElm.title,
                  _label =  $([]),
                  _labelUsed;

              field
                  .data(labelizor, !0);

              if ( _hideClass  ||  (_useLabel  &&  !(_labelText || _inpTitle)) )
              {
                // NOTE: we only seek out <label> if we intend to either a) use _hideClass,
                // or b) we don't have _labelText candidates already and want to _useLabel 
                _label = field.closest('label', form);
                if ( !_label[0]  &&  fieldElm.id )
                {
                  _label = form.find('label[for="'+fieldElm.id+'"]').eq(0);
                }
              }

              if ( !_labelText )
              {
                _labelText = !(_useLabel && _labelFilter) ?
                                  // default to using input[title]
                                  (cfg.preferTitle && _inpTitle) || (_useLabel && _label.text()) || _inpTitle:
                              $.isFunction(_labelFilter) ?
                                  _labelFilter(_label, field):
                                  _label.find(_labelFilter).text();
                _labelUsed = _labelText != _inpTitle;
                _labelText = $.trim( _labelText.replace(cfg.lRe||'', cfg.lPlace||'') );
              }

              if ( _hideClass  &&  (!cfg.condHide  ||  (_useLabel  &&  _labelUsed)) )
              {
                _label.addClass(_hideClass);
              }

              if ( !hasPlaceholderSupport )
              {
                field
                    .data( labelizorlabel, _labelText);
                form
                    .bind('submit', _hideAllPlaceholders);
              }
              else if ( !_placeholder )
              {
                field
                    .attr('placeholder', _labelText);
              }

              if ( _inpTitle )
              {
                field
                    .attr('title', _inpTitle||_labelText);
              }
              field
                  .bind('focus', _hidePlaceholder)
                  .bind('blur change', _showPlaceholder);

              _showPlaceholder.call( fieldElm, labelizor );
            }

          });
    return  this;
  };


})(jQuery);
