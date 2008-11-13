(function ($) {

  $.fn.extend({

    labelizor : function ( hideClass, blurClass ) {

      hideClass = hideClass || 'stream';
      blurClass = blurClass || 'labelized';

      return this.each(function(i) {

              var _this = this;

              if (_this.id || _this.title && $(_this).is(':text, textarea'))
              {
                var _label = $('label[for='+_this.id+']'),
                    _labelText = $.trim( (_label.text() || _this.title).replace(/(\*|:[\W\S]*$)/g, '') ),
                    _removeDefaultValue = function ()
                    {
                      if (_this.value == _labelText) {
                        _this.value = '';
                        $(_this).removeClass(blurClass);
                      }
                    };

                _label.addClass(hideClass);
                $(_this)
                    .attr('title', _labelText)
                    .focus(function (e) {
                        _removeDefaultValue();
                      })
                    .blur(function (e) {
                        if (!_this.value)
                        {
                          _this.value = _labelText;
                          $(_this).addClass(blurClass);
                        }
                      });

                if (!_this.getAttribute('value')) // note: using _this.value would cause problems when the user leaves the page and then history back/forward.
                {
                  _this.value = _labelText;
                  $(_this).addClass(blurClass);
                }
                    
                $(_this.form).submit(_removeDefaultValue);
              }
            });
    }

  });
  

})(jQuery);
