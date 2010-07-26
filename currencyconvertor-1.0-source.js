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
          .delegate( inputSel, 'focus', function (e) {
              $(this).select();
            })
          .delegate( inputSel, 'keyup', function (e) {
              var activeInput = this,
                  inputData = $(activeInput).data(currencyConvertor);
              if (this.value != inputData.V )
              {
                inputData.V = this.value;
                var activeNum = $.prettyNum.read( activeInput, lang ) * inputData.F;
                activeInput.value = $.prettyNum.make( activeInput, lang, { trail: true,  milleSep: cfg.milleSep } );
                table.find('input').each(function () {
                    if ( this != activeInput )
                    {
                      var data = $(this).data(currencyConvertor);
                      this.value = $.prettyNum.make( activeNum / data.F, lang, { decimals: data.D,  milleSep: cfg.milleSep } );
                    }
                  });
              }
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
                              D: factor>=cfg.decimalsThreshold ? cfg.decimals : 0
                            };
                      trow
                          .append( cfg.inputCellTmpl )
                          .find( inputSel )
                              .data( currencyConvertor, data)
                              .val( $.prettyNum.make( cfg.startAmount / factor, lang, { decimals: data.D,  milleSep: cfg.milleSep } ) );
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