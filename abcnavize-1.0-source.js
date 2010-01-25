// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.abcnavize v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires:
//  * $.fn.detach (jQuery 1.4, or eutils-1.0)
//  * $.setFrag, $.getFrag, $.encodeFrag   (eutils-1.0)
//
(function($){


  var A = $.fn.abcnavize = function (cfg) {
      cfg = $.extend({
          //startOn: 'A',
          allBtn: !0 // true
        }, cfg);
      return this.each(function(){
          var table = $(this),
              tRows = table.find('tbody tr'),
              fragmPrefix = 'index:',
              txt = txt || A.texts[ table.closest('[lang]').attr('lang') ]  ||  A.texts.en,
              noFoundMsg,
              abcNavClick = function  (e) {
                  var link = $(e.target).closest('a');
                  if ( link.is('a:not(.current)') )
                  {
                    link.addClass('current');
                    abcNav.find('a').removeClass('current');
                    var fragment = $.getFrag( link.attr('href') );
                    e.type == 'click'  &&  $.setFrag(fragment);
                    var vRows = tRows  // visible rows
                                    .hide()
                                    .filter(function(){
                                        return !fragment  ||  $(this).data('abcnav-fragm') == fragment;
                                      })
                                        .show();

                    if (vRows.length)
                    {
                      noFoundMsg && noFoundMsg.detach();
                      vRows
                          .removeClass('even')
                          .filter(':odd')
                              .addClass('even');
                    }
                    else
                    {
                      noFoundMsg = noFoundMsg || $('<tr class="nothingfound"><td colspan="'+ tRows.eq(0).find('td, th').length +'"><strong>'+ txt.noFoundMsg +'</strong></td></tr>');
                      noFoundMsg.insertBefore(tRows[0]);
                    }
                  }
                  return false;
                },
              foundLetters = {};
          
          abcNav = $('<div class="abcnav"><span>'+ txt.abcTitle +'</span> <b /></div>')
                        .bind('click', abcNavClick), 
          abcNavList = abcNav.find('b'),
          cfg.allBtn && abcNavList.append('<a href="#">'+ txt.abcAll +'</a>');


          tRows.each(function(){
              var tr = $(this),
                       firstLetter = $.trim( tr.text() ).charAt(0).toUpperCase(),
                       fragment = fragmPrefix + firstLetter;

              tr.data('abcnav-fragm',  fragment);

              // populate alphabet menu
              if ( !foundLetters[fragment] )
              {
                foundLetters[fragment] = 1;
                var link = $('<a>'+firstLetter+'</a>').attr('href', '#'+$.encodeFrag(fragment));
                abcNavList.append(' ', link);
              }

            });

          var fragment = $.getFrag()  ||  (cfg.startOn && fragmPrefix+cfg.startOn ),
              startOnSelector = foundLetters[ fragment ] ?
                                    '[href$="#'+ $.encodeFrag(fragment) +'"]':
                                    '';
          abcNavClick.call(null, { target: abcNav.find('a'+startOnSelector)[0] });

          abcNav.insertBefore(table);
          abcNavList = undefined;
        });
    };


  A.texts = {
      en: {
          abcTitle:      'Initial:',
          abcAll:        'Show all',
          noFoundMsg:    'No items match this criteria.'
        },
      is: {
          abcTitle:      'Upphafsstafur:',
          abcAll:        'Sýna alla',
          noFoundMsg:    'Engar línur uppfylla þessi leitarskilyrði.'
        }
    };


      
  
})(jQuery);