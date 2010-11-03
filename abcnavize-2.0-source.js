// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.abcnavize v 2.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires:
//  * jQuery 1.4+
//  * $.setFrag, $.getFrag, $.encodeFrag   (eutils-1.1)
//
(function($){


  var A = $.fn.abcnavize = function (cfg) {
      cfg = $.extend({
            menuTmpl:     '<div class="abcnav"><span>%{title}</span> <b /></div>',
            menuListElm:  'b',
            menuItmTmpl:  '<a href="%{frag}">%{label}</a>',
            menuItmSel:   'a',
            currentClass: 'current',
            //listElm:      selector|element,
            items:        '>li',
            noneFound:    '<li class="nothingfound"><strong>%{msg}</strong></li>',
            fragmPrefix:  'index:',
            //startHidden:    false, // true hides all rows initially
            //startOn:        letter, // Defaults to the first link in the menu
            allBtn:       !0, // true
            zebraize:     !0  // true
          }, 
          (!cfg || cfg.preset != 'table') ? {} : {
              listElm:   '> tbody',
              items:     '> tr',
              noneFound: '<tr class="nothingfound"><td colspan="%{colspan}"><strong>%{msg}</strong></td></tr>'
            },
          cfg
        );

      return this.each(function(){
          var container = $(this),
              listElm = !cfg.listElm ?
                            container:
                        typeof cfg.listElm != 'string' ?
                            $( cfg.listElm ):
                            container.find(cfg.listElm),
              items = listElm.find(cfg.items).detach(),
              rowsByLetter = {},
              txt = txt || A.texts[ container.closest('[lang]').attr('lang') ]  ||  A.texts.en,
              noFoundMsg,
              abcNavClick = function  (e) {
                  var link = $(e.target).closest('a'),
                      item = link.closest(cfg.menuItmSel);
                  if ( link[0]  && !item.is('.'+currentClass) )
                  {
                    // trigger (bubbling) event on the container
                    var ev = $.Event('abcnavfilter');
                    ev.menuItem = item;
                    container.trigger(ev);
                    if ( !ev.isDefaultPrevented() )
                    {
                      var currentClass = cfg.currentClass;
                      abcNav.find(cfg.menuItmSel+'.'+currentClass).removeClass(currentClass);
                      item.addClass(currentClass);
                      var fragment = $.getFrag( link.attr('href') );
                      e.type == 'click'  &&  $.setFrag(fragment);
                      if ( fragment == cfg.fragmPrefix+'all' )
                      {
                        fragment = '';
                      }
                      listElm.find(cfg.items).detach();
                      var vRows = fragment ?
                              $( rowsByLetter[fragment] ):
                              items;
                      if (vRows.length)
                      {
                        vRows.appendTo( listElm );
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
                                          typeof cfg.noFound != 'string' ?
                                              cfg.noneFound:
                                              cfg.noneFound
                                                  .replace( '%{msg}', txt.noFoundMsg )
                                                  .replace( '%{colspan}', items.eq(0).children().length ) // needed for tables
                                        );
                        }
                        noFoundMsg.appendTo( listElm );
                      }
                      // trigger (bubbling) event on the container
                      var ev2 = $.Event('abcnavfiltered');
                      ev2.menuItem = item;
                      ev2.visibleRows = vRows;
                      container.trigger(ev2);
                    }
                  }
                  return false;
                },
          
              abcNav = $( cfg.menuTmpl.replace( '%{title}', txt.abcTitle ) )
                            .bind('click', abcNavClick),
              abcNavList =  typeof cfg.menuListElm=='string' ?
                                abcNav.find(cfg.menuListElm):
                                $( cfg.menuListElm );

          if ( cfg.allBtn )
          {
            abcNavList.append(
                $( 
                    cfg.menuItmTmpl
                        .replace( '%{frag}', '#'+ (cfg.startHidden?cfg.fragmPrefix+'all':'') )
                        .replace( '%{label}', txt.abcAll )
                  )
              );
          }


          items.each(function(){
              var tr = $(this),
                   firstLetter = $.trim( tr.text() ).charAt(0).toUpperCase(),
                   fragment = cfg.fragmPrefix + firstLetter;

              tr.data('abcnav-fragm',  fragment);

              var slot = rowsByLetter[fragment];
              // populate alphabet menu
              if ( !slot )
              {
                abcNavList.append( ' ',
                    $(
                        cfg.menuItmTmpl
                            .replace( '%{frag}', '#'+$.encodeFrag(fragment) )
                            .replace( '%{label}', firstLetter )
                      )
                  );
                slot = rowsByLetter[fragment] = [];
              }
              slot.push( tr[0] );

            });

          var fragment = $.getFrag()  ||  ( cfg.startOn  &&  cfg.fragmPrefix+cfg.startOn ),
              startOnSelector = (!!rowsByLetter[ fragment ]  ||  fragment == cfg.fragmPrefix+'all') ?
                                    '[href$="#'+ $.encodeFrag(fragment) +'"]':
                                    '';
          if ( startOnSelector )
          {
            abcNavClick.call(null, { target: abcNav.find('a'+startOnSelector)[0] });
          }
          else if ( !cfg.startHidden )
          {
            items.appendTo( listElm );
          }

          container
              .before( abcNav )
              .data( 'abcnav', {
                  menu:  abcNav,
                  items: items,
                  cfg:   cfg
                });

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