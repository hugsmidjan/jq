// ----------------------------------------------------------------------------------
// jQuery.fn.fieldsetCloner v 1.1
// ----------------------------------------------------------------------------------
// (c) 2011-2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson             -- http://mar.anomy.net
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.8


(function($, fieldsetCloner){

  $.fn.fieldsetCloner = fieldsetCloner = function ( opts ) {
      return this.each(function () {
          var fieldset = $(this),
              texts = fieldsetCloner.i18n[ fieldset.closest('[lang]').attr('lang') ] || fieldsetCloner.i18n.en,
              cfg = $.extend({}, fieldsetCloner.defaults, texts, opts );

          cfg.rowName = ( fieldset.attr(cfg.rowNameSel||'') ||
                          fieldset.find(cfg.rowNameSel).eq(0).text() ||
                          cfg.rowName )
                            .replace(/:/g,'');
          cfg.$protoFS = fieldset.clone( !!cfg.cloneEvents )
                            .each(function () {
                                //add cloned classes
                                var clNames = $.trim(this.className);
                                clNames  &&  (clNames = (clNames+' ').replace(/\s+/g, '-'+cfg.cloneClass+' ') + clNames);
                                clNames += ' '+cfg.cloneClass;
                                this.className = clNames;
                              });
          cfg.$delBtn =  cfg.addDelBtn  &&
                          $(cfg.delBtnTemplate
                              .replace(/%\{className\}/g, cfg.delBtnClass)
                              .replace(/%\{label\}/g,     cfg.delBtnLabel)
                              .replace(/%\{tooltip\}/g,   cfg.delBtnTitle + cfg.rowName)
                            )
                              .on('click', function (e) {
                                  e.preventDefault();
                                  var fsElm = $(this).data('$fsclnr');
                                  cfg.cloneCount--;
                                  fsElm
                                      .slideUp(cfg.showSpeed, function(){ fsElm.remove(); });

                                  if ( cfg.cloneMax && cfg.cloneCount < cfg.cloneMax )
                                  {
                                    $cloneBtn.show();
                                  }

                                  if ( cfg.$place==='appendTo' )
                                  {
                                    // check if this fieldset has cloneButton inside it (i.e. is the last fieldset)
                                    fsElm.find('.'+cfg.addBtnClass)
                                        [cfg.$place]( fsElm.prev() );
                                  }
                                });
          cfg.$place = ({after:'insertAfter', bottom:'appendTo'})[ cfg.buttonPlacement ] || 'insertAfter';
          cfg.$num = cfg.initialCloneNo || 1; // Counter for field-name suffixes
          cfg.cloneCount = 1; // internal number for clonefields
          cfg.cloneMax = parseInt(fieldset.attr(cfg.cloneMaxSel||''), 10) || null;

          // Create Clone Button
          var $cloneBtn = $(cfg.addBtnTemplate
              .replace(/%\{className\}/g, cfg.addBtnClass)
              .replace(/%\{label\}/g,     cfg.addBtnLabel + cfg.rowName)
              .replace(/%\{tooltip\}/g,   cfg.addBtnTitle + cfg.rowName)
            )
              [cfg.$place](fieldset);
          $cloneBtn
              .on('click', function (e) {
                  e.preventDefault();
                  var btnInside = cfg.$place==='appendTo',
                      lastFS = btnInside ? $cloneBtn.parent() : $cloneBtn.prev(),
                      _newFieldset;

                  cfg.cloneCount++;
                  if ( cfg.cloneMax && cfg.cloneCount === cfg.cloneMax )
                  {
                    $cloneBtn.hide();
                  }

                  btnInside  && $cloneBtn.detach();
                  _newFieldset = _cloneFieldset(cfg)
                                    .hide()
                                    .insertAfter( lastFS )
                                    .slideDown(cfg.showSpeed);
                  btnInside  &&  $cloneBtn[cfg.$place]( _newFieldset );
                  cfg.afterClone  &&  cfg.afterClone(_newFieldset);
                });
        });

  };

  fieldsetCloner.defaults = {
      buttonPlacement:   'after',        // available: 'after', 'before', 'bottom', 'top'
      addBtnTemplate:    '<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',
      addBtnClass:       'addrow',
      cloneClass:        'clone',
      cloneSep:           '-',
      cloneClassAttributes: true,
      //initialCloneNo:     1,
      //cloneEvents:       false,
      //rowNameSel:        '' , //hægt að nota selector string, eða attribute-name
      //cloneMaxSel:       'data-clonemax', // data-clonemax (max number of cloner fields including original)
      showSpeed:         'fast',          // 'fast', 'slow', integer -- 0 for instant -- >0 for milliseconds
      //addDelBtn:         false,
      //delBtnAppendTo:    sub-selector for cloneBlock - if falsy then appendTo the cloneBlock itself.
      delBtnTemplate:    '<a class="%{className}" href="#" title="%{tooltip}">%{label}</a>',
      delBtnClass:       'delrow',
      //afterClone:        function(newFS) {} // callback funtion with refrence to newly cloned fieldset
    };

  fieldsetCloner.i18n = {
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
    };


  var msie7 = 8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10),

      _cloneFieldset =  function ( cfg ) {

          var fieldset = cfg.$protoFS.clone( !!cfg.cloneEvents ),
              _attr,
              idSuffix = (cfg.cloneClassAttributes ? cfg.cloneSep + cfg.cloneClass : '')+cfg.cloneSep,
              idRegExp = new RegExp('('+idSuffix+'\\d+)?$');
          idSuffix += cfg.$num++;

          if ( cfg.$delBtn )
          {
            cfg.$delBtn.clone(true)
                .data('$fsclnr', fieldset)
                .appendTo(
                    fieldset.find(cfg.delBtnAppendTo).add(fieldset).last()
                  );
          }

          // give new id's to elements
          if ( (_attr = fieldset[0].id) )
          {
            fieldset[0].id = _attr.replace(idRegExp, idSuffix);
          }

          // correct other attributes
          fieldset.find('*')
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
                                    m[1] + (parseInt(m[2],10) + cfg.$num) + m[3]:
                                    _attr + '-' + cfg.$num;  // automatically add a numeric suffix if there's no number on the original.
                  }

                  /* MSIE 6&7 hack - because of field-cloning expando bug of doom.  (See also: http://www.quirksmode.org/dom/domform.html)  */
                  if (msie7 && /^(?:INPUT|SELECT|TEXTAREA|BUTTON)$/.test(_elm.tagName))
                  {
                    var _newField = $( _elm.outerHTML.replace(/( name=)[^ >]+/, '$1"'+_attr+'"') );
                    $(_elm).replaceWith(_newField);
                  }
                  /* END: MSIE 6&7 hack */
                });

          return fieldset;
        };



})(jQuery);