// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.popUps v 1.0
// ----------------------------------------------------------------------------------
// (c) 2008 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Gereric Popup window script ** version 1.0 **
// requires jQuery 1.2
// works with jQuery 1.3

(function($, uscore, blank, undefined, p){
  // NOTE: `uscore` is a hack to prevent the overzealous dean.edwards.name/packer from accidentally handling _top and _blank as "private" variable names

  p = $.fn.popUps = function (cfg) {

/* Optional config keys:
        {
          target:      '_blank',      // This setting does NOT override the element's target="" attribute.
          url:         'about:blank', // URL to load when the window is opened.
                                      // NOTE: this setting does NOT override the element's href="" (or action="") atribute.
          window:      window,        // window from which the new window is .open()ed
                                      // NOTE: this only affects elements with either config.url set, or an explicit target that doesn't start with '_')
          markTitle:   false,  // if true, will add $.fn.popUps.titleSuffix[lang] suffix to the link's title="" atribute
          titleSuffix: {}      // Example: { en:'mytitlesuffix', se:'hurdygurdy' },
          width:       0,      // px
          height:      0,      // px
          minimal:     false,  // true will automatically turn all of the following UI/Chrome options to false.

          location:    Boolean,
          menubar:     Boolean,
          resizable:   Boolean,
          scrollbars:  Boolean,
          status:      Boolean,
          toolbar:     Boolean
        },
*/
    cfg = cfg || {};

    var settings = [];
    if (cfg.width)  { settings.push('width='+cfg.width); }
    if (cfg.height) { settings.push('height='+cfg.height); }
    cfg.titleSuffix = $.extend( {}, p.titleSuffix, cfg.titleSuffix||{} );

    $.each(['location','menubar','scrollbars','status','toolbar'], function(i, param){
      if (cfg[param] !== undefined) { settings.push(param + (cfg[param]?'=yes':'=no') ); }
      else if (cfg.minimal) { settings.push(param+'=no'); }
    });
    // default to resziable=yes (if any settings are present)
    settings.length && settings.push( 'resizable=' + ((cfg.resizable===undefined || cfg.resizable) ?'yes':'no') );
    cfg._wSettings = settings.join(',');

    return this.each(function(i, _elm){
        var _Elm = $(_elm);
        _Elm.data(dataKey, cfg);

        if (cfg.markTitle  &&  _elm.tagName != 'FORM')
        {
          var _elmLang = ( $.lang && $.lang(_elm) ) || $('html').attr('lang')  || 'en';
          _elm.title = (_elm.title || _Elm.text() || _elm.value) +' '+ (cfg.titleSuffix[_elmLang] || cfg.titleSuffix.en);
        }

        switch(_elm.tagName)
        {
          case 'FORM':
            _Elm.bind('submit', _pop);
            break;
          case 'INPUT':
          case 'BUTTON':
            _Elm.bind('click', _popButton);
            break;
          //case 'A':
          //case 'AREA':
          default:
            _Elm.bind('click', _pop);
            break;
        }

      });


  };


  $.extend($.fn.popUps, {
    v: 1.0,
    titleSuffix: {
      is : '(opnast í nýjum glugga)',
      en : '(opens in a new window)'
    }
  });


  var dataKey  = 'pop'+(new Date()).getTime(),
       i = 0,

      _pop = function (e) 
      {
        var _elm = this,
            cfg = $(_elm).data(dataKey),
            _target = _elm.target || cfg.target || uscore+blank;

        if (cfg.url || _target.indexOf(uscore)!=0 )  // don't do window.open for targets '_blank', '_top', '_parent', '_self', etc.
        {                                             // ...since we're passing the event through (i.e. not stopping it w. `return false;`)
                                                      // if target starts with '_' all window settings are ignored.
          var _newWin = (cfg.window || window).open(cfg.url || 'about:'+blank, _target, cfg._wSettings);
          setTimeout(function(){ _newWin.focus(); }, 150);
        }
        if (!_elm.target)  // if there's no target attribute on the _elm
        {
          _elm.target = _target;  // set it temporarily (while the action is taking place)
          setTimeout(function() { // and then remove/reset it again (after a while)
            _elm.target = '';
          }, 150);
        }
        // return true/undefined because there might be other handlers that'd like to modify the link.href before it's activated,
        // or in case of form.submit() validation handlers might interpret `false` as an indicator that the form
        // is invalid. ...anyway this is the most unobtrusive way to do things.
      },



      _popButton = function (e)
      {
        var _Form = $(this.form),
            originalCfg = _Form.data(dataKey);

        _Form
            .data( dataKey, $(this).data(dataKey) )
            .bind('submit', _pop);

        setTimeout(function(){  // cleanup - unconditionally (not 'on submit') because the submit event might get cancelled for some reason.
          if (originalCfg)
          {
            _Form
                .data(dataKey, originalCfg);
          }
          else
          {
            _Form
                .removeData(dataKey)
                .unbind('submit', _pop);
          }
        }, 150);
      };


})(jQuery, '_', 'blank');
