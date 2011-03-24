// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.fieldsetCloner v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Valur Sverrisson          
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils  (uses: $.inject() )


(function($){

  $.fieldsetCloner = {
    defaults: {
      buttonPlacement  : 'after',        // available: 'after', 'before', 'bottom', 'top'
      addBtnTemplate   : '<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',
      addBtnClass      : 'addrow',
      cloneClass       : 'clone',
      rowNameSel       : 'h2,h3,legend', //hægt að nota elements eða attributes
      showSpeed        : 'fast',          // 'fast', 'slow', integer - 0 for instant
      afterClone       : function(newBlock) {} // callback funtion with refrence to newly cloned block
    },
    i18n: {
      'en' : {
        addBtnLabel : 'Add ',
        addBtnTitle : 'Add new ',
        rowName     : 'row'
      },
      'is' : {
        addBtnLabel : 'Bæta við ',
        addBtnTitle : 'Bæta við auka ',
        rowName     : 'röð'
      }
    },
    placeMethods : {
      before : 'insertBefore',
      after  : 'insertAfter',
      top    : 'prependTo',
      bottom : 'appendTo'
    },
    cloneFieldset : function ( block, num, cfg ) {
      var _oldIe = $.browser.msie && parseInt($.browser.version, 10) < 8,
          _oldElms = _oldIe && block.find('*'), _newField, /* MSIE 6&7 hack - because of field-cloning expando bug of doom.  (See also: http://www.quirksmode.org/dom/domform.html)  */
          _new = block.clone(),
          _elms = _new.find('*'),
          i = 0, _elm, _attr, _newAttr, _nameMatch;
      
      _new.find('.'+cfg.addBtnClass).remove();

      // give new id's to elements
      if (_attr = _new[0].id) 
      {
         _newAttr = num == 1 ? _attr + '-'+ cfg.cloneClass +'-' + num : _attr.replace(/\d+$/, num);
        _new.attr('id', _newAttr);
      }

      //add cloned classes
      if (num == 1)
      {
        var classNames = _new[0].className.split(/\s+/g);
        for (var i=0; i<classNames.length; i++)
        {
          classNames[i] = classNames[i] +'-'+ cfg.cloneClass;
        }
        _new.addClass(cfg.cloneClass + ' ' + classNames.join(' '));
      } 

      // correct other attributes
      while (_elm = _elms[i++]) 
      {
        if (_attr = _elm.id) 
        {
          _newAttr = num == 1 ? _attr + '-'+ cfg.cloneClass +'-' + num : _attr.replace(/\d+$/, num);
          $(_elm).attr('id', _newAttr);
        }

        if (_attr = $(_elm).attr('for')) 
        {
          _newAttr = num == 1 ? _attr + '-'+ cfg.cloneClass +'-' + num : _attr.replace(/\d+$/, num);
          $(_elm).attr('for', _newAttr);
        }

        if (_attr = _elm.name) 
        {
          _nameMatch = _attr.match(/^(.+)(\d+)(\D*)$/);
          _elm.name = _attr = (_nameMatch) ? 
              _nameMatch[1] + (parseInt(_nameMatch[2],10)+1) + _nameMatch[3]:
              _attr + '-2'; // automatically add a numeric suffix if there's no number on the original.
        }
        
        /* MSIE 6&7 hack - because of field-cloning expando bug of doom.  (See also: http://www.quirksmode.org/dom/domform.html)  */
        if (_oldElms && /^INPUT|SELECT|TEXTAREA|BUTTON$/.test(_elm.tagName))
        {
          _newField = $(_elm.outerHTML.replace(/( name=)[^ >]+/, '$1"'+_attr+'"'));
          $(_elm).replaceWith(_newField);
        }
        /* END: MSIE 6&7 hack */
        
      }

      return _new;
    }
  };
  
  $.fn.fieldsetCloner = function ( cfg ) {
    
    var fsC = $.fieldsetCloner,
        _txts = fsC.i18n[ $.lang() ] || fsC.i18n.en,
        _cfg = $.extend({}, fsC.defaults, _txts, cfg ),
        _btnPlace =  fsC.placeMethods[_cfg.buttonPlacement];

    return this.each(function(){
        var _cloneBlock = $(this),
            _lastClone = _cloneBlock,
            _num = 0,
            _rowName = (_cloneBlock.attr(_cfg.rowNameSel) || _cloneBlock.find(_cfg.rowNameSel).filter(':first').text() || _cfg._rowName).replace(/:/g,'');
            _cloneBtn = $($.inject( _cfg.addBtnTemplate, {
                                      className : _cfg.addBtnClass,
                                      label     : _cfg.addBtnLabel + _rowName,
                                      tooltip   : _cfg.addBtnTitle + _rowName
                                    })
                          );

        _cloneBtn
            .bind('click', function (e) {
                _num++;
                _cloneBlock = $.fieldsetCloner.cloneFieldset(_lastClone, _num, _cfg);
              
                if (_cfg.buttonPlacement == 'bottom' || _cfg.buttonPlacement == 'top')
                { // How do we want to handle duplicated cloneBtn's?
                  _lastClone.find('.'+_cfg.addBtnClass)[_btnPlace](_cloneBlock);
                }
                
                _cloneBlock.hide().insertAfter(_lastClone).slideDown(_cfg.showSpeed);
                _lastClone = _cloneBlock;
                _cfg.afterClone(_cloneBlock);
                e.preventDefault();
              })
            [_btnPlace](_cloneBlock);
    });
    
  }

})(jQuery);