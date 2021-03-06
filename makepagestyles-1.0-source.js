/* jQuery.fn.makePageStyles 1.0  -- (c) 2011-2019 Hugsmiðjan ehf.   @preserve */
// ----------------------------------------------------------------------------------
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//
(function ($, makePageStyles) {

  $[makePageStyles] = function (cfg) {
      cfg = $.extend({}, defaults, cfg);
      var lang = cfg.lang || $('html').attr('lang') || 'en',
          txt = i18n[ lang ] || i18n.en,
          makeItem = function (type, classIdx, menuElm, opts) {
              opts = opts || {};
              var tag =  opts.tag || cfg.buttonTag || 'a';
              var isLink = tag === 'a';
              var href = !isLink ? '' : opts.href ? ' href="'+opts.href+'"' : ' href="#" role="button"';
              return $(cfg.itemTempl
                          .replace(/%\{tag\}/g, tag)
                          .replace(/ href=('|")?#\1/, '')
                          .replace(isLink ? / type=('|")?button\1/ : '', '' )
                          .replace(/<a( |>)/, '<a'+href+'$1')
                          .replace(/%\{label\}/g, txt[type+'L'])
                          .replace(/%\{title\}/g, txt[type+'T'])
                        )
                          .addClass( cfg.itemClasses[classIdx] )
                          .appendTo( menuElm );
            },
          menuCont = $( cfg.menuTempl.replace(/%\{headline\}/g, txt.headline) ),
          menuFB = menuCont.find( cfg.menuSel );

      if ( cfg.boldBtn ) {
        var boldOn = !!$.cookie('font-bold'),
            toggleBold = function (e) {
                if (e) {
                  boldOn = !boldOn;
                  $.cookie('font-bold', (boldOn ? 'on' : null), { path:cfg.cookiePath, expires:cfg.cookieExpires });
                  e.preventDefault();
                }
                $('body').toggleClass('font-bold', boldOn);
              };
        toggleBold();
        makeItem('b', 2, menuFB)
            .on('click', toggleBold);
      }
      if ( cfg.fontsizeBtns ) {
        makeItem('up',  0, menuFB);
        makeItem('dwn', 1, menuFB);
        if ( $.fn.fontsizer ) {
          menuFB.fontsizer( cfg.fontsizerCfg );
        }
      }
      if ( cfg.userstyles ) {
        var menuUS = menuFB.clone().empty(),
            userstylesOn = !!(cfg.userstyles  &&  $.cookie('userstyles')==='on'),
            toggleMode = function (e) {
                if ( e ) {
                  e.preventDefault();
                  // toggle style cookie and refresh the page.
                  userstylesOn = !userstylesOn;
                  $.cookie('userstyles', (userstylesOn?'on':null), { path:cfg.cookiePath, expires:cfg.cookieExpires });
                  $.reloadPage ?
                      $.reloadPage():
                      location.replace(location.href.split('#')[0]); // quick and dirty method
                } else if ( userstylesOn ) {
                  // turn userstyles on
                  menuFB
                      .before( menuUS )
                      .detach();
                  $('link[rel="stylesheet"]').attr('rel', 'disabledstylesheet');
                  $('<link rel="stylesheet" type="text/css" class="userstylesheet" />')
                      .appendTo( 'head' )
                      .attr({
                          media: cfg.userstyleMedia,
                          href:  $('meta[name="X-UserstyleURL"]').attr('content'),
                        });
                  $('body').addClass('userstyles-on');
                }
              };

        makeItem('uon',  3, menuFB)
            .on('click', toggleMode);

        makeItem('uoff', 4, menuUS)
            .on('click', toggleMode);
        makeItem('pref', 5, menuUS, {
          tag:'a',
          href: '//minar.stillingar.is/lesa/form/?redirect=yes&l='+ lang,
        });

        toggleMode();
      }

      if ( cfg.appendTo ) {
        menuCont.appendTo( cfg.appendTo );
      }
      return menuCont;
    };

  var defaults = $[makePageStyles].defaults = {
          fontsizeBtns:   true,
          //userstyles:     false,
          //boldBtn:        false,
          boldClass:      'font-bold',

          menuTempl:      '<div class="pagestyle screen"><h2>%{headline}:</h2><ul/></div>',
          //lang:           null, // defaults to html[lang] || 'en'
          appendTo:       'body',
          menuSel:        'ul',
          buttonTag:      'a',
          itemTempl:      '<li><%{tag} title="%{title}">%{label}</%{tag}></li>',
          itemClasses:    ['up','dwn','bold','userstyles','off','settings'],
          userstyleMedia: 'all',
          cookieExpires:  365,
          cookiePath:     '/',
          fontsizerCfg:   { doClientSide:true },
        },

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
              prefT:    'Breyta mínum lita- og leturstillingum',
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
              prefT:    'Change my text and color settings',
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
              prefT:    'Ændre mine tekst- og farveindstillinger',
            },
        };

}(window.jQuery, 'makePageStyles'));





