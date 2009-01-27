// encoding: UTF-8

// Requires jQuery 1.2.6
// Runs OK in 1.3

jQuery.fn.mailtoEnabler = function (_cfg)
{
  var _this = this,
      $ = jQuery;

  if (_this.length)
  {
    _cfg = $.extend({
        //successClass : 'email-active',
        dotSymbols   : ['dot','punktur','period','\\.'],
        atSymbols    : ['at','hj[aá]','@'],
        openBracket  : [' ','\\-','_','{','\\[','('],
        closeBracket : [' ','\\-','_','}','\\]',')'],
        createLinks  : true
      },
      _cfg);

    var _ptrnStart = '['+_cfg.openBracket.join('')+']+(',
        _ptrnEnd   = ')['+_cfg.closeBracket.join('')+']+',
        _atPattern = new RegExp(_ptrnStart+_cfg.atSymbols.join('|')+_ptrnEnd, 'i'),
        _dotPattern = new RegExp(_ptrnStart+_cfg.dotSymbols.join('|')+_ptrnEnd, 'gi'),
        _mailtoPrefix = /^.*\/?mailto\s*:\s*/,
        _decodeURI = window.decodeURI || function(s){return s;}; // NOTE: <-- this causes the script will fail to enable certain mailto: links in in IE5/Win

    return _this.each(function(){
        var _link = $('a', this)[0] || this,
            _isAnchor = _link.tagName == 'A',
            _linkText = (_link.href) ? _decodeURI(_link.href).replace(_mailtoPrefix, '') : '',
            _useInnerText = !_linkText || _linkText == _decodeURI(_link.href);

        if (_useInnerText)
        {
          $('img', _link).each(function(){ $(this).replaceWith(this.alt); });
          _linkText = $(_link).text().replace(_mailtoPrefix, '');
        }
        _linkText = _linkText
            .replace(_atPattern, '@')
            .replace(_dotPattern, '.');

        _cfg.successClass && $(_link).addClass(_cfg.successClass);

        // create a link inside the element.
        if (_cfg.createLinks  &&  !_isAnchor)
        {
          _link = $(_link).wrapInner('<a />').find('a')[0];
          _isAnchor = 1;
        }
        if (_isAnchor)
        {
          _link.href = 'mailto:' + _linkText;
        }
        if (_useInnerText)
        {
          $(_link).text(_linkText);
        }
      });
  }

  return _this;

};
