// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.labelizor v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Einar Kristján Einarsson  -- einarkristjan (at) gmail.com
//   * Borgar Þorsteinsson       -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

// Requires jQuery 1.2.6
// Runs OK in 1.3

(function ($) {

  $.fn.labelizor = function ( cfg, b ) {

    // also supporting the old `$(':input').labelizor(hideClass, blurClass)` syntax
    var a = cfg && cfg.charAt ? cfg : '';
    cfg = $.extend({
        //lRe:         /(\*|:[\W\S]*$)/g,     // pattern used to clean the <label> text.
        //lPlace:      '',                    // replacement text/pattern for cfg.lRe
        //labelFilter: null,                  // label sub-selector  (may also be a function - see below)
        //labelFilter: function(label, input){ return label.find('i').text() || input.title || label.text(); },
        //labelText:   'My custom label text' // this text trumps all other texts...

        //preferTitle: false,                 // true makes .labelizor favour input's title="" over its <label/>
        //condHide:    false,                 // true causes <label> to only be hidden when it's text is used.
        useLabel:     true,                   // false makes the script completely ignore the label element.

        blurClass:    b||'labelized',
        hideClass:    a||'stream'
      },
      !a&&cfg);

    var _hideClass   = cfg.hideClass,
        _blurClass   = cfg.blurClass,
        _labelFilter = cfg.labelFilter,
        _useLabel    = cfg.useLabel;

    return this.each(function(){
        var _this = this,
            _jQthis = $(_this);

        if ( (_this.id || _this.title)  &&  _jQthis.is(':text, :password, textarea') )
        {
          var _labelText = cfg.labelText,
               // use _jQthis.parents(':last') as scope/context to also .find() <label> inside .detached() document fragments
               _inpTitle = _this.title,
               _label =  !_useLabel  &&  _labelText  &&  !_hideClass ?
                            $([]): // <label> is not needed since we have both _labelText and 
                            $( _jQthis.parents('form:first, :last').eq(0).find('label[for="'+_this.id+'"]:first') ),

              _removeLabelValue = function (e) {
                  if (_jQthis.val() == _labelText)
                  {
                    _jQthis.val('').removeClass(_blurClass);
                  }
                };

          if (!_labelText)
          {
            _labelText = !_useLabel || !_labelFilter ?
                              // default to using input title=""
                              (cfg.preferTitle && _inpTitle) || (_useLabel && _label.text()) || _inpTitle:
                          $.isFunction(_labelFilter) ?
                              _labelFilter(_label, _jQthis):
                              _label.find(_labelFilter).text();
            _labelText = $.trim( _labelText.replace(cfg.lRe||/(\*|:[\W\S]*$)/g, cfg.lPlace||'') );
          }

          if (!cfg.condHide  ||  (_useLabel  &&  (cfg.preferTitle  &&  _labelText != _inpTitle)  &&  !cfg.labelText) )
          {
            _label.addClass(_hideClass);
          }

          _jQthis
              .attr('title', _inpTitle||_labelText)
              .bind('focus', _removeLabelValue)
              .bind('blur', function (e) {
                  if (!_jQthis.val())
                  {
                    _jQthis.val(_labelText).addClass(_blurClass);
                  }
                });

          if (_labelText  &&  !_this.getAttribute('value')  &&  (!_this.value || _this.value == _labelText))
          {
            _jQthis
                .val(_labelText)
                .addClass(_blurClass);
          }

          $(_this.form)
              .bind('submit', _removeLabelValue);
        }
      });
  };


})(jQuery);
