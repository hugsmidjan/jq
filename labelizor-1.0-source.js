// Requires jQuery 1.2.6
// Runs OK in 1.3

(function ($) {

  $.fn.labelizor = function ( cfg, b ) {

    // also supporting the old `$(':input').labelizor(hideClass, blurClass)` syntax
    var a = cfg && cfg.charAt ? cfg : '';
    cfg = $.extend({
        //lRe:         /(\*|:[\W\S]*$)/g,     // pattern used to clean the <label> text.
        //lPlace:      '',                    // replacement text/pattern for cfg.lRe
        //labelFilter: 'i',                   // label sub-selector  (may also be a function - see below)
        //labelFilter: function(labelElm){ return $('i', labelElm).text(); },
        //labelText:   'My custom label text'
        blurClass:    b||'labelized',
        hideClass:    a||'stream'
      },
      !a&&cfg);

    var _hideClass = cfg.hideClass,
        _blurClass = cfg.blurClass,
        _labelFilter = cfg.labelFilter;

    return this.each(function(){

        var _this = this;

        if (_this.id || _this.title && $(_this).is(':text, textarea'))
        {
          var _labelText = cfg.labelText,
               _label = (_labelText || _hideClass)  &&  $('label[for='+_this.id+']').addClass(_hideClass),

              _removeLabelValue = function (e) {
                  if (_this.value == _labelText) {
                    _this.value = '';
                    $(_this).removeClass(_blurClass);
                  }
                };

          if (!_labelText) {
            _labelText = !_labelFilter ?
                              _label.text():
                          $.isFunction(_labelFilter) ?
                              _labelFilter(_label):
                              $(_labelFilter, _label).text();
            _labelText = $.trim( (_labelText || _this.title).replace(cfg.lRe||/(\*|:[\W\S]*$)/g, cfg.lPlace||'') );
          }

          $(_this)
              .attr('title', _labelText)
              .bind('focus', function (e) {
                  _removeLabelValue();
                })
              .bind('blur', function (e) {
                  if (!_this.value) {
                    _this.value = _labelText;
                    $(_this).addClass(_blurClass);
                  }
                });

          if (!_this.getAttribute('value')) // note: using _this.value would cause problems when the user leaves the page and then history back/forward.
          {
            _this.value = _labelText;
            $(_this).addClass(_blurClass);
          }
              
          $(_this.form).bind('submit', _removeLabelValue);
        }
      });
  };
  

})(jQuery);
