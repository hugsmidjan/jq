(function($){

  $.fn.liveSum = function(cfg){
      cfg = $.extend({
                instant: 1,  // controls whether sum should be updated on "keyup"
                // parseFunc:  function(strVal, fieldElm){ return parseFloat('0'+strVal); },
                // sumFormatFunc: function(strVal, fieldElm){ return parseFloat('0'+strVal); },
                sumElm: this.slice(-1) // default sumElm to last item in collection
              }, cfg);
      
      var fields = this.not( cfg.sumElm ),
          sumElm = $(cfg.sumElm);

      fields
          .bind((cfg.instant?'keyup ':'')+'change.liveSum', function (e) {
              var sum = 0;
              fields.each(function(){
                  var field = $(this),
                      val = field[ field.is(':input') ? 'val' : 'text' ]();
                  val = cfg.parseFunc ? cfg.parseFunc( val, field ) : parseFloat(val);
                  if (!isNaN(val))
                  {
                    sum += val;
                  }
                });
              sum = cfg.sumFormatFunc ? cfg.sumFormatFunc( sum, sumElm ) : sum;
              sumElm.is(':input') ? 
                  sumElm.val( sum ).trigger('change'):
                  sumElm.text( sum );
            })
          .eq(0)
              .trigger('change.liveSum');

      return this;
    };

})(jQuery);