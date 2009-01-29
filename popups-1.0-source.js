// encoding: utf-8
// Gereric Popup window script ** version 1.0 **
// requires jQuery 1.2
// works with jQuery 1.3

(function($, p){


  p = $.fn.popUps = function (cfg) {

    cfg = cfg || {};

/*
  Default Config =
    {
      target    : '_top', // checks the element first for a target="" attribute
      markTitle : false,  // if true, will add $.fn.popUps.titleSuffix[lang] suffix to the link's title="" atribute
      titleSuffix: { en:'mytitlesuffix', se:'hurdygurdy' },
      width     : null,   // px
      height    : null,   // px
      minimal   : false,  // true will automatically turn all of the following UI/Chrome options to false.

      location   : null,
      menubar    : null,
      resizable  : null,
      scrollbars : null,
      status     : null,
      toolbar    : null
    }
*/

    var settings = [];
    if (cfg.width)  { settings.push('width='+cfg.width); }
    if (cfg.height) { settings.push('height='+cfg.height); }
    cfg.titleSuffix = $.extend( {}, p.titleSuffix, cfg.titleSuffix || {} );

    $.each(['location','menubar','scrollbars','status','toolbar'], function(i, param){
      if (cfg[param] !== undefined) { settings.push(param + (cfg[param]?'=yes':'=no') ); }
      else if (cfg.minimal) { settings.push(param+'=no'); }
    });
    // default to resziable=yes
    settings.push( 'resizable=' + ((cfg.resizable===undefined || cfg.resizable) ?'yes':'no') );
    cfg._wSettings = settings.join(',');

    return this.each(function(i, _elm){
        var _Elm = $(_elm);
        _Elm.data(_dataKey, cfg);

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


  var undefined,
       _dataKey  = 'pop'+(new Date()).getTime(),
       i = 0,


      _pop = function (e) 
      {
        var uscore = '_', // hack to prevent overzealous dean.edwards.name/packer from accidentally handling _top and _blank as "private" variable names
            _elm = this,
            _conf = $(_elm).data(_dataKey),
            _target = _elm.target || _conf.target || uscore+'top',
            _wasBlank = (_target.toLowerCase() == uscore+'blank'),
            _url = _conf.url || 'about:blank';

        if (_wasBlank)
        {
          _elm.target = '';                          // temporarily disable the _elm.target
          _target = _dataKey + i++;  // temporarily set the _target to something 'concrete' - otherwise browsers may open two windows
        }
        if (_target.indexOf('_') !== 0) // don't do window.open for targets '_top', '_parent', '_self', etc.
        {                               // ...since we're passing the event through (i.e. not stopping it w. `return false;`)
          var _newWin = window.open(_url, _target, _conf._wSettings);
          setTimeout(function(){ _newWin.focus(); }, 150);
        }
        if (!_elm.target)  // if there's no target attribute on the _elm
        {
          _elm.target = _target;  // set it temporarily (while the action is taking place)
          setTimeout(function() { // and then remove/reset it again (after a while)
            _elm.target = (_wasBlank) ? uscore+'blank' : '';
          }, 150);
        }
        // return true/undefined because there might be other handlers that'd like to modify the link.href before it's activated,
        // or in case of form.submit() validation handlers might interpret `false` as an indicator that the form
        // is invalid. ...anyway this is the most unobtrusive way to do things.
        // Only problem is it makes Event.fire(linkElm, 'click') fail, as the popup opens empty.
      },



      _popButton = function (e)
      {
        var _Form = $(this.form),
            _wasFormCfg = _Form.data(_dataKey);

        _Form
            .data( _dataKey, $(this).data(_dataKey) )
            .bind('submit', _pop);

        setTimeout(function(){  // cleanup - unconditionally (not 'on submit') because the submit event might get cancelled for some reason.
          if (_wasFormCfg)
          {
            _Form
                .data(_dataKey, _wasFormCfg);
          }
          else
          {
            _Form
                .removeData(_dataKey)
                .unbind('submit', _pop);
          }
        }, 150);
      };





})(jQuery);