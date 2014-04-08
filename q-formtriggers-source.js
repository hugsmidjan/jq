// $.fn.formTriggers -- (c) 2012 Hugsmiðjan ehf.
// Valur Sverrisson

/*
  Usage:
  Add trigger class to the container on the triggers
  add data-trigger attribute to the inputs/options that indicate what ID they should trigger, followed by -open or -close action for select options and radio buttons
  Use closed class to hide block in the begining

  f.ex.: <input type="radio" data-trigger="opt1-open opt2-close" />
*/

(function($){
    var defaultCfg = {
          triggerSel: '.trigger',
          subreqClass: 'subreq',
          showFunc:    'fadeIn',
          hideFunc:    'hide',
          closedClass: 'closed'
        },
        triggerFunc = function (triggerData, cfg) {
          triggerData = triggerData.split(/\s+/);
          $.each(triggerData, function (i) {
              var tData = triggerData[i].split('-'),
                  tOpCl = tData.pop();
              tData = tData.join('-');

              if ( tOpCl == 'open' )
              {
                $('#'+tData)[cfg.showFunc]('fast').find('.'+cfg.subreqClass).removeClass(cfg.subreqClass).addClass('req');
              }
              else
              {
                $('#'+tData)[cfg.hideFunc]('fast').find('.req').removeClass('req').addClass(cfg.subreqClass);
              }
            });
        };


  $.fn.formTriggers = function(o) {
    var cfg = $.extend(defaultCfg, o);
    return this.each(function() {

      $(this).find('.'+cfg.closedClass).hide().find('.req').removeClass('req').addClass(cfg.subreqClass);

      $(this).find(cfg.triggerSel)
          .each(function () {
              var trigger = $(this);
              trigger
                  .on('change.formtriggers', 'input:radio', function (e) {
                      triggerFunc( trigger.find('input:checked').attr('data-trigger'), cfg );
                    })
                  .on('change.formtriggers', 'input:checkbox', function (e) {
                      var tInp = $(this);
                      triggerFunc( tInp.attr('data-trigger') + '-' + ( tInp.is(':checked') ? 'open' : 'close'), cfg  );
                    })
                  .on('change.formtriggers', 'select', function (e) {
                      triggerFunc( trigger.find('option:selected').attr('data-trigger'), cfg );
                    })
                  .find('select, input:checked')
                      .trigger('change.formtriggers');
            });
    });
  };
})(jQuery);