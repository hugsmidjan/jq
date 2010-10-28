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
// TODO:
//  * trigger onfilter and onfiltered events
//
(function($){


  var A = $.fn.abcnavize = function (cfg) {
      cfg = $.extend({
          menuTmpl:     '<div class="abcnav"><span>%{title}</span> <b /></div>',
          listSel:      'b',
          itmTmpl:      '<a href="%{frag}">%{label}</a>',
          itmSel:       'a',
          noFoundTmpl:  '<tr class="nothingfound"><td colspan="%{colspan}"><strong>%{msg}</strong></td></tr>',
          rowSelector:  'tbody tr',
          activeClass:  'current',
          fragmPrefix:  'index:',
          //startHidden: false, // true hides all rows initially
          //startOn:    letter, // Defaults to the first link in the menu
          allBtn:       !0, // true
          zebraize:     !0  // true
        }, cfg);
      return this.each(function(){
          var table = $(this),
              tRows = table.find(cfg.rowSelector),
              
              txt = txt || A.texts[ table.closest('[lang]').attr('lang') ]  ||  A.texts.en,
              noFoundMsg,
              abcNavClick = function  (e) {
                  var link = $(e.target).closest('a'),
                      item = link.closest(cfg.itmSel),
                      currentClass = cfg.activeClass;
                  if ( !item.is('.'+currentClass) )
                  {
                    abcNav.find(cfg.itmSel+'.'+currentClass).removeClass(currentClass);
                    item.addClass(currentClass);
                    var fragment = $.getFrag( link.attr('href') );
                    e.type == 'click'  &&  $.setFrag(fragment);
                    var vRows = tRows  // visible rows
                                    .hide()
                                    .filter(function(){
                                        return !fragment  ||  $(this).data('abcnav-fragm') == fragment;
                                      })
                                        .css('display', '');

                    if (vRows.length)
                    {
                      noFoundMsg && noFoundMsg.detach();
                      if ( cfg.zebraize )
                      {
                        vRows
                            .removeClass('even')
                            .filter(':odd')
                                .addClass('even');
                      }
                    }
                    else
                    {
                      if ( !noFoundMsg )
                      {
                        noFoundMsg = $( 
                                        cfg.noFoundTmpl
                                            .replace( '%{msg}', txt.noFoundMsg )
                                            .replace( '%{colspan}', tRows.eq(0).children().length ) // needed for tables
                                      );
                      }
                      noFoundMsg.insertBefore( tRows[0] );
                    }
                  }
                  return false;
                },
              foundLetters = {},
          
              abcNav = $( cfg.menuTmpl.replace( '%{title}', txt.abcTitle ) )
                            .bind('click', abcNavClick),
              abcNavList = abcNav.find(cfg.listSel);
          
          if ( cfg.allBtn )
          {
            $( cfg.itmTmpl.replace( '%{frag}', '#' ).replace( '%{label}', txt.abcAll ) ).appendTo( abcNavList );
          }


          tRows.each(function(){
              var tr = $(this),
                       firstLetter = $.trim( tr.text() ).charAt(0).toUpperCase(),
                       fragment = cfg.fragmPrefix + firstLetter;

              tr.data('abcnav-fragm',  fragment);

              // populate alphabet menu
              if ( !foundLetters[fragment] )
              {
                foundLetters[fragment] = 1;
                var link = $( cfg.itmTmpl.replace( '%{frag}', '#'+$.encodeFrag(fragment) ).replace( '%{label}', firstLetter ) );
                abcNavList.append(' ', link);
              }

            });

          var fragment = $.getFrag()  ||  ( cfg.startOn  &&  cfg.fragmPrefix+cfg.startOn ),
              startOnSelector = foundLetters[ fragment ] ?
                                    '[href$="#'+ $.encodeFrag(fragment) +'"]':
                                    '';
          if ( startOnSelector )
          {
            abcNavClick.call(null, { target: abcNav.find('a'+startOnSelector)[0] });
          }
          else if ( !!cfg.startHidden )
          {
            tRows.hide();
          }

          abcNav.insertBefore(table);
          abcNavList = undefined;
          table
              .data( 'abcnav', {
                  menu: abcNav,
                  cfg:  cfg
                });
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