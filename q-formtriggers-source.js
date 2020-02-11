/* $.fn.formTriggers  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
// Valur Sverrisson

/*
  Usage:
  Add trigger class to the container on the triggers
  add data-trigger attribute to the inputs/options that indicate what ID they should trigger followed by -open or -close action
  Use closed

  f.ex.: <input type="checkbox" data-trigger="opt1-open opt2-close" />
*/

(function($){
    var defaultCfg = {
          triggerSel: '.trigger',
          reqClass:   'req',
          subreqClass: 'subreq',
          subdisabledClass: 'subdisabled',
          showFunc:    'fadeIn',
          showSpeed:   'fast',
          hideFunc:    'hide',
          hideSpeed:    0,
          closedClass: 'closed',

        },
        triggerFunc = function (triggerData, cfg) {
          if (triggerData)
          {
            triggerData = triggerData.split(/\s+/);
            $.each(triggerData, function (i) {
                var tData = triggerData[i].split('-');
                var tOpCl = tData.pop();
                tData = tData.join('-');
                var $targets = $('#'+tData);

                if ( tOpCl == 'open' ) {
                  $targets[cfg.showFunc](cfg.showSpeed);

                  $targets.find('.'+cfg.subreqClass).addBack()
                      .filter('.'+cfg.subreqClass)
                          .addClass(cfg.reqClass);

                  $targets.find('.'+cfg.subdisabledClass).addBack()
                      .filter('.'+cfg.subdisabledClass)
                          .find('input,textarea,select').prop('disabled', false);
                }
                else {
                  $targets[cfg.hideFunc](cfg.hideSpeed);

                  $targets.find('.'+cfg.subreqClass).addBack()
                      .filter('.'+cfg.subreqClass)
                          .removeClass(cfg.reqClass);

                  $targets.find('.'+cfg.subdisabledClass).addBack()
                      .filter('.'+cfg.subdisabledClass)
                          .find('input,textarea,select').prop('disabled', true);
                }
              });
          }
        };


  $.fn.formTriggers = function(o) {
    var cfg = $.extend(defaultCfg, o);
    return this.each(function() {

      $(this)
          .find('.'+cfg.closedClass)
              .hide()
              .find('.'+cfg.reqClass)
                  .addBack()
                  .filter('.'+cfg.reqClass)
                      .removeClass(cfg.reqClass)
                      .addClass(cfg.subreqClass);

      $(this).find(cfg.triggerSel)
          .each(function () {
              var trigger = $(this);
              trigger
                  .on('change.formtriggers', 'input:radio', function (e) {
                      triggerFunc( trigger.find('input:checked').attr('data-trigger'), cfg );
                    })
                  .on('change.formtriggers', 'input:checkbox', function (e) {
                      var tInp = $(this);
                      if ( tInp.is('.inverse') )
                      {
                        triggerFunc( tInp.attr('data-trigger') + '-' + ( tInp.is(':checked') ?  'close' : 'open'), cfg  );
                      }
                      else
                      {
                        triggerFunc( tInp.attr('data-trigger') + '-' + ( tInp.is(':checked') ? 'open' : 'close'), cfg  );
                      }
                    })
                  .on('change.formtriggers', 'select', function (e) {
                      triggerFunc( trigger.find('option:selected').attr('data-trigger'), cfg );
                    })
                  .find('select, input:checked, .inverse:checkbox')
                      .trigger('change.formtriggers');
            });
    });
  };
})(jQuery);