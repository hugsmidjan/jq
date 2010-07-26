// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.currencyConvertor v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  requires:  jQuery.prettyNum 1.1
*/
(function($, defaultCfg, currencyConvertor, emptyCellSuffix){
  currencyConvertor = 'currencyConvertor';
  emptyCellSuffix =  ' class="empty" />';
  
  $[currencyConvertor] = {};

  defaultCfg = $[currencyConvertor].config = {
      rateCellSel:       'td',
      emptyHeadCellTmpl: '<th'+emptyCellSuffix,
      emptyCellTmpl:     '<td'+emptyCellSuffix,
      inputCellTmpl:     '<td class="fi_txt"><input type="text" /></td>',
      inputSel:          '.fi_txt input',
      milleSep:          true,
      decimals:          2,
      decimalsThreshold: 5,
      startAmount:       1000
      // lang:           undefined, // optional override for the dom language - useful when the DOM is incomplete/wrong
    };

  $.fn[currencyConvertor] = function (cfg) {
      cfg = $.extend({}, defaultCfg, cfg);

      var table    = this,
          lang      = cfg.lang  ||  this.closest('[lang]').attr('lang'),
          inputSel  = cfg.inputSel,
          numConfig = {
              lang:     lang,
              decimals: cfg.decimals
            };
      table
          .delegate( inputSel, 'focusin', function (e) {
              $(this).select();
            })
          .delegate( inputSel, 'keyup', function (e) {
              var activeInput = this,
                  inputData = $(activeInput).data(currencyConvertor);
              if (this.value != inputData.V )
              {
                inputData.V = this.value;
                var num = $.prettyNum.read( activeInput, lang );
                if ( num != inputData.v )
                {
                  inputData.v = num;
                  var activeNum = num * inputData.F; 
                  activeInput.value = $.prettyNum.make( activeInput, { trail: true,  lang: lang,  milleSep: cfg.milleSep } );
                  table.find('input').each(function () {
                      if ( this != activeInput )
                      {
                        var data = $(this).data(currencyConvertor),
                            val = data.v = activeNum / data.F;
                        this.value = data.V = $.prettyNum.make( val, data.PN );
                      }
                    });
                }
              }
            })
          .delegate( inputSel, 'focusout', function (e) {
              var data = $(this).data(currencyConvertor);
              this.value = data.V = $.prettyNum.make( data.v, data.PN );
            })

          .find( 'tr' )
              .each(function () {
                  var trow = $(this);
                  if ( trow.parent().is('thead, tfoot') )
                  {
                    trow.append( cfg.emptyHeadCellTmpl );
                  }
                  else
                  {
                    var factor = 0,
                        num = 0;
                    trow.find( cfg.rateCellSel )
                        .each(function () {
                            factor +=  $.prettyNum.read( this, lang ) || 0;
                            num++;
                          });
                    factor = factor/num;
                    if ( factor )
                    {
                      var data = {
                              F: factor,
                              PN: {
                                  lang: lang,
                                  decimals: factor>=cfg.decimalsThreshold ? cfg.decimals : 0,
                                  milleSep: cfg.milleSep
                                },
                              v: cfg.startAmount / factor
                            },
                          val = data.V = $.prettyNum.make( data.v, data.PN );
                      trow
                          .append( cfg.inputCellTmpl )
                          .find( inputSel )
                              .data( currencyConvertor, data)
                              .val( val );
                    }
                    else
                    {
                      trow
                          .append( cfg.emptyCell );
                    }
                  }
                });
              

      return table;
    }

})(jQuery);