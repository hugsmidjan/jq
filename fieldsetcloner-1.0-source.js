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
//  - eutils  ( uses: $.inject()  )


(function($){

  var _oldIe = 8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10),

      _placeMethods = {
          before : 'insertBefore',
          after  : 'insertAfter',
          top    : 'prependTo',
          bottom : 'appendTo'
        },

      _cloneFieldset =  function ( fieldset, num, cfg ) {

          var firstCloning = num === 1,
              _newFieldset = fieldset.clone( !!cfg.cloneEvents ),
              _attr,
              _newAttr,
              idSuffix = '-'+(cfg.cloneClass||'clone')+'-',
              idRegExp = new RegExp('('+idSuffix+'\\d+)?$');
          idSuffix += num;

          if ( cfg.addDelBtn )
          {
            if ( cfg.fsets.length === 1 ) // then fieldset must be the original fieldset - and thus has no delBtn
            {
              var delBtn = $($.inject( cfg.delBtnTemplate, {
                                  className : cfg.delBtnClass,
                                  label     : cfg.delBtnLabel,
                                  tooltip   : cfg.delBtnTitle + cfg.rowName
                                })
                              ),
                  targetElm = cfg.delBtnAppendTo ?
                                  _newFieldset.find(cfg.delBtnAppendTo):
                                  _newFieldset;
              delBtn
                  .appendTo( targetElm );
            }

            var delBtnSelector = '.'+cfg.delBtnClass;
            _newFieldset
                .undelegate(delBtnSelector, 'click.fsDelRow')
                .delegate(delBtnSelector, 'click.fsDelRow', function (e) {
                    e.preventDefault();
                    var addBtn = _newFieldset.find('.'+cfg.addBtnClass)
                                      .detach();
                    _newFieldset
                        .slideUp(cfg.showSpeed, function () {
                            _newFieldset.remove();
                          });
                    var pos = jQuery.inArray( _newFieldset, cfg.fsets );
                    cfg.fsets.splice( pos, 1);
                    addBtn
                        [_placeMethods[cfg.buttonPlacement]](cfg.fsets[0]);
                  });
          }

          _newFieldset.find('.'+cfg.addBtnClass).remove();

          // give new id's to elements
          if ( (_attr = _newFieldset[0].id) )
          {
            _newFieldset[0].id = _attr.replace(idRegExp, idSuffix);
          }

          //add cloned classes
          if (firstCloning)
          {
            var classNames = _newFieldset[0].className.split(/\s+/g);
            for (var i=0; i<classNames.length; i++)
            {
              classNames[i] = classNames[i] +'-'+ cfg.cloneClass;
            }
            _newFieldset.addClass(cfg.cloneClass + ' ' + classNames.join(' '));
          }

          // correct other attributes
          _newFieldset.find('*')
              .each(function () {
                  var _elm = this;
                  if ( (_attr = _elm.id) )
                  {
                    _elm.id = _attr.replace(idRegExp, idSuffix);
                  }

                  if ( (_attr = $(_elm).attr('for')) )
                  {
                    $(_elm).attr('for', _attr.replace(idRegExp, idSuffix));
                  }

                  if ( (_attr = _elm.name) )
                  {
                    var m = _attr.match(/^(.*)(\d+)(\D*)$/);
                    _elm.name = m ?
                                    m[1] + (parseInt(m[2],10)+1) + m[3]:
                                    _attr + '-2'; // automatically add a numeric suffix if there's no number on the original.
                  }

                  /* MSIE 6&7 hack - because of field-cloning expando bug of doom.  (See also: http://www.quirksmode.org/dom/domform.html)  */
                  if (_oldIe && /^(?:INPUT|SELECT|TEXTAREA|BUTTON)$/.test(_elm.tagName))
                  {
                    var _newField = $( _elm.outerHTML.replace(/( name=)[^ >]+/, '$1"'+_attr+'"') );
                    $(_elm).replaceWith(_newField);
                  }
                  /* END: MSIE 6&7 hack */
                });

          return _newFieldset;
        },



      fsC = $.fieldsetCloner = {

          defaults: {
              buttonPlacement:   'after',        // available: 'after', 'before', 'bottom', 'top'
              addBtnTemplate:    '<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',
              addBtnClass:       'addrow',
              cloneClass:        'clone',
              //cloneEvents:       false,
              //rowNameSel:        '' , //hægt að nota selector string, eða attribute-name
              showSpeed:         'fast',          // 'fast', 'slow', integer -- 0 for instant -- >0 for milliseconds
              //addDelBtn:         false,
              //delBtnAppendTo:    sub-selector for cloneBlock - if falsy then appendTo the cloneBlock itself.
              delBtnTemplate:    '<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',
              delBtnClass:       'delrow',
              //beforeClone:       function(newFS) {} // callback funtion with refrence to newly cloned fieldset
              //afterClone:        function(newFS) {} // callback funtion with refrence to newly cloned fieldset
            },

          i18n: {
              'en':  {
                  addBtnLabel:  'Add ',
                  addBtnTitle:  'Add new ',
                  delBtnLabel:  'Delete',
                  delBtnTitle:  'Delete this ',
                  rowName:      'row'
                },
              'is':  {
                  addBtnLabel:  'Bæta við ',
                  addBtnTitle:  'Bæta við auka ',
                  delBtnLabel:  'Eyða',
                  delBtnTitle:  'Eyða þessari ',
                  rowName:      'röð'
                }
            }

        };


  $.fn.fieldsetCloner = function ( opts ) {

      var _txts =     fsC.i18n[ this.lang() ] || fsC.i18n.en,
          cfg =      $.extend({}, fsC.defaults, _txts, opts ),
          _btnPlace = _placeMethods[cfg.buttonPlacement];

      return this.each(function(){
          var _fieldset = $(this),
              _num = 0,
              _rowName = cfg.rowName =
                            ( _fieldset.attr(cfg.rowNameSel||'') ||
                              _fieldset.find(cfg.rowNameSel).eq(0).text() ||
                              cfg.rowName )
                                .replace(/:/g,''),

              _cloneBtn = $($.inject( cfg.addBtnTemplate, {
                                className : cfg.addBtnClass,
                                label     : cfg.addBtnLabel + _rowName,
                                tooltip   : cfg.addBtnTitle + _rowName
                              })
                            ),
              fsets = cfg.fsets = [_fieldset];

          _cloneBtn
              .bind('click', function (e) {
                  _num++;
                  var _newFieldset = _cloneFieldset(fsets[0], _num, cfg);

                  cfg.beforeClone  &&  cfg.beforeClone(_newFieldset);

                  if ( /^(?:bottom|top)$/.test( cfg.buttonPlacement ) )
                  {
                    // How do we want to handle duplicated cloneBtn's?
                    fsets[0].find('.'+cfg.addBtnClass)
                        [_btnPlace]( _newFieldset );
                  }
                  _newFieldset
                      .hide()
                      .insertAfter(fsets[0])
                      .slideDown(cfg.showSpeed);

                  fsets.unshift( _newFieldset );
                  cfg.afterClone  &&  cfg.afterClone(_newFieldset);
                  e.preventDefault();
                })
              [_btnPlace](_fieldset);

      });

  };

})(jQuery);