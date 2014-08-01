// $.fn.formTriggers -- (c) 2012 Hugsmiðjan ehf.
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
          subreqClass: 'subreq',
          showFunc:    'fadeIn',
          showSpeed:   'fast',
          hideFunc:    'hide',
          hideSpeed:    0,
          closedClass: 'closed'
        },
        triggerFunc = function (triggerData, cfg) {
          if (triggerData)
          {
            triggerData = triggerData.split(/\s+/);
            $.each(triggerData, function (i) {
                var tData = triggerData[i].split('-'),
                    tOpCl = tData.pop();
                tData = tData.join('-');

                ;;;window.console&&console.log( triggerData );

                if ( tOpCl == 'open' )
                {
                  $('#'+tData)[cfg.showFunc](cfg.showSpeed)
                      .find('.'+cfg.subreqClass)
                      .addBack()
                      .filter('.'+cfg.subreqClass)
                          .addClass('req');
                }
                else
                {
                  $('#'+tData)[cfg.hideFunc](cfg.hideSpeed)
                      .find('.'+cfg.subreqClass)
                      .addBack()
                      .filter('.'+cfg.subreqClass)
                          .removeClass('req');
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
              .find('.req')
                  .addBack()
                  .filter('.req')
                      .removeClass('req')
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