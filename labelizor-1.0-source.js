(function ($) {
  
  var _defaultHideClass = 'stream';
  
  $.fn.extend({
    labelizor : function ( hideClass ) {
      this.each(function(i) {
        var _field = $( this );
        if (this.id && _field.is(':text, textarea')) {
          var _label = $('label[for='+this.id+']'),
              _labelText = $.trim( _label.text().replace(/(\*|:[\W\S]*$)/, '') );
          if (!this.defaultValue && !this.value) {
            this.defaultValue = _labelText;
          }
          _label.addClass( hideClass || _defaultHideClass );
          _field
            .attr('title', _labelText)
            .focus(function () {
              if (this.value == this.defaultValue) {
                this.value = '';
              }
            })
            .blur(function () {
              if (this.value == '') {
                this.value = this.defaultValue;
              }
            });
        }
      });
      return this; // don't break the chain
    }
  });
})(jQuery);
