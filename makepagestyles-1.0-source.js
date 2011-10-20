// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.makePageStyles v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($, makePageStyles){

  $[makePageStyles] = function (cfg) {
      cfg = $.extend({}, defaults, cfg);
      var lang = $('html').attr('lang') || 'en',
          txt = i18n[ lang ] || i18n.en,
          makeItem = function (type, classIdx, menuElm) {
              return $(cfg.itemTempl
                            .replace(/%\{label\}/g, txt[type+'L'])
                            .replace(/%\{title\}/g, txt[type+'T'])
                        )
                          .addClass( cfg.itemClasses[classIdx] )
                          .appendTo( menuElm );
            },
          menuCont = $( cfg.menuTempl.replace(/%\{headline\}/g, txt.headline) ),
          menuFB = menuCont.find( cfg.menuSel );

      if ( cfg.boldBtn )
      {
        var boldOn = !!$.cookie('font-bold'),
            toggleBold = function (e) {
                if (e)
                {
                  boldOn = !boldOn;
                  $.cookie('font-bold', (boldOn ? 'on' : null), { path:cfg.cookiePath, expires:cfg.cookieExpires });
                  e.preventDefault();
                }
                $('body').toggleClass('font-bold', boldOn);
              };
        toggleBold();
        makeItem('b', 2, menuFB)
            .bind('click', toggleBold);
      }
      if ( cfg.fontsizeBtns )
      {
        makeItem('up',  0, menuFB);
        makeItem('dwn', 1, menuFB);
      }
      if ( cfg.userstyles )
      {
        var menuUS = menuFB.clone().empty(),
            userstylesOn = !!(cfg.userstyles  &&  $.cookie('userstyles')),
            setMode = function (e) {
                if ( e )
                {
                  userstylesOn = !userstylesOn;
                  $.cookie('userstyles', (userstylesOn?'on':null), { path:cfg.cookiePath, expires:cfg.cookieExpires });
                  e.preventDefault();
                }
                if ( userstylesOn )
                {
                  menuFB
                      .before( menuUS )
                      .detach();
                  $('link[rel="stylesheet"]').attr('rel', 'disabledstylesheet');
                  $('<link rel="stylesheet" type="text/css" class="userstylesheet" />')
                      .attr({
                          'media': cfg.userstyleMedia,
                          'href':  $('meta[name="X-UserstyleURL"]').attr('content')
                        })
                      .appendTo( 'head' );
                }
                else if (e)
                {
                  menuUS
                      .before( menuFB )
                      .detach();
                  $('link.userstylesheet').remove();
                  $('link[rel="disabledstylesheet"]').attr('rel', 'stylesheet');
                }
              };

        makeItem('uon',  3, menuFB)
            .bind('click', setMode);

        makeItem('uoff', 4, menuUS)
            .bind('click', setMode);
        makeItem('pref', 5, menuUS)
            .find('a')
                .attr('href', location.protocol +'//minar.stillingar.is/lesa/form/?redirect=yes&l='+ lang );

        setMode();
      }

      if ( cfg.appendTo )
      {
        menuCont.appendTo( cfg.appendTo );
      }
      return menuCont;
    };

  var defaults = $[makePageStyles].defaults = {
          fontsizeBtns:   true,
          userstyles:     false,
          boldBtn:        false,
          boldClass:      'font-bold',

          menuTempl:      '<div class="pagestyle screen"><h2>%{headline}:</h2><ul/></div>',
          appendTo:       'body',
          menuSel:        'ul',
          itemTempl:      '<li><a href="#" title="%{title}">%{label}</a></li>',
          itemClasses:    ['up','dwn','bold','userstyles','off','settings'],
          userstyleMedia: 'all',
          cookieExpires:  365,
          cookiePath:     '/'
        };

      i18n = $[makePageStyles].i18n = {
          is: {
              headline: 'Útlit síðu',
              upL:      'Stærra letur',
              upT:      'Stækka letrið',
              dwnL:     'Minna letur',
              dwnT:     'Minnka letrið',
              bL:       'Feitletrun',
              bT:       'Feitletra allan texta',
              uonL:     'Nota mínar stillingar',
              uonT:     'Nota mínar lita- og leturstillingar',
              uoffL:    'Venjulegt útlit',
              uoffT:    'Skipta yfir í venjulegt útlit vefsins',
              prefL:    'Breyta stillingum',
              prefT:    'Breyta mínum lita- og leturstillingum'
            },
          en: {
              headline: 'Page style',
              upL:      'Larger font',
              upT:      'Increase font size',
              dwnL:     'Smaller font',
              dwnT:     'Reduce font size',
              bL:       'Bold',
              bT:       'Toggle bold text',
              uonL:     'Use my settings',
              uonT:     'Switch to my text and color settings',
              uoffL:    'Normal style',
              uoffT:    'Switch to the normal style of this website',
              prefL:    'Edit settings',
              prefT:    'Change my text and color settings'
            },
          dk: {
              headline: 'Sidens visning',
              upL:      'Større skrifttype',
              upT:      'Gør skrifttypen større',
              dwnL:     'Mindre skrifttype',
              dwnT:     'Gør skrifttypen mindre',
              bL:       'Fed tekst',
              bT:       'Gør teksten fed',
              uonL:     'Benyt mine indstillinger',
              uonT:     'Skift til mine tekst- og farveindstillinger',
              uoffL:    'Normal visning',
              uoffT:    'Skift til denne hjemmesides normale visning',
              prefL:    'Redigér indstillinger',
              prefT:    'Ændre mine tekst- og farveindstillinger'
            }
        };

}(jQuery, 'makePageStyles'));





