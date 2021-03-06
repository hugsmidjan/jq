/* jQuery.fn.dumbTags v 1.0  -- (c) 2013 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// (c) 2012-2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
/*

  Enables simple Facebook-style keyword-tagging autocomplete fields.

  Requires:
    * jQuery 1.6+
    * jQuery UI autocomplete +(Core, Widget, Position)

  TODO:
   * Wite proper documentation. (Until then see `dumbTags.defaults` below...)


*/
(function ($) {

  var dataKey = 'dumbtags_cfg',
      methods = {
        /*
          destroy: function ( cfg ) {
              // perform cleanup!
            },
        */
          disable: function ( cfg ) {
              this.parent()
                  .addClass( cfg.disabledClass )
                  .find('input')
                      .prop('disabled', true);
            },
          enable: function ( cfg ) {
              this.parent()
                  .removeClass( cfg.disabledClass )
                  .find('input')
                      .prop('disabled', false);
            },
        };

  var dumbTags = $.fn.dumbTags = function (options) {

      if ( methods[options] ) {
        this.each(function () {
            var elm = $(this);
            elm = elm.is('input') ? elm : elm.find('input:text');
            elm.each(function () {
                var input = $(this),
                    cfg = input.data(dataKey);
                cfg  &&  methods[options].call( input, cfg );
              });
          });
      }
      else {
        this.each(function () {
            var input = $(this),
                cfg  = $.extend(true, {}, dumbTags.defaults, options ),
                lang = input.closest('[lang]').attr('lang').substr(0.2),
                i18n = $.extend({}, cfg.i18n[lang]||cfg.i18n.en ),
                submName =  input.attr('name'),
                acUrl = cfg.ajax  &&
                        (
                          ('acUrl' in cfg  &&  cfg.acUrl) ||
                          input.closest('['+ cfg.acUrlAttr +']', this.form.parentNode).attr( cfg.acUrlAttr )  ||
                          $(this.form).attr('action')  ||
                          ''
                        ),
                acName = cfg.ajax  &&  encodeURIComponent( input.attr( cfg.acNameAttr ) || cfg.acName || submName ),

                acLocalValues = [],
                prefills = [],
                activeTags = [],

                buildTagElms = function (items) {
                    var tagElms = [];
                    $.each(items, function (i, itm) {
                        // Transform the raw autocomplete "itm" object into a
                        // trimmed tagItem
                        var tagItem = {
                                value: itm.id||itm.value, // id
                                tag:   itm.value,            // human readable tag "name"
                              },
                            tagElm = $( cfg.tagTempl );

                        if ( tagItem.value ) {
                          tagElm
                              [cfg.htmlTags ? 'html' : 'text']( tagItem.tag )
                              .data( 'dumbTag', tagItem)
                              .each(function () {
                                  cfg.processTag  &&  cfg.processTag( tagElm, itm );
                                })
                              .append(
                                  $('<input type="hidden"/>')
                                      .attr({
                                          name:  submName,
                                          value: tagItem.value,
                                        })
                                )
                              .append(
                                  $( cfg.tagDelTempl )
                                      .attr( 'title', i18n.delTitle||i18n.delLabel )
                                      .html( i18n.delLabel )
                                );

                          activeTags.push( tagItem.tag.toLowerCase() );
                          tagElms.push( tagElm[0], document.createTextNode(' ') );
                        }
                      });
                    return $(tagElms).insertBefore( input );
                  },
                delTag = function ( tagElm, autoDelete ) {
                    if ( !input[0].disabled ) {
                      tagElm = $(tagElm);
                      var removeEv = $.Event('dumbTagRemove');
                      removeEv.autoDelete = autoDelete;
                      tagElm.trigger(removeEv);
                      if ( autoDelete  ||  !removeEv.isDefaultPrevented() ) {
                        var pos = $.inArray( tagElm.data('dumbTag').tag.toLowerCase(), activeTags );
                        if ( pos > -1 ) {
                          activeTags.splice( pos , 1);
                        }
                        tagElm.remove();
                        !autoDelete  &&  input.trigger('focus');
                        // IDEA: trigger 'dumbTagRemoved' event  here!
                        return true;
                      }
                    }
                    return false;
                  },

                addItem = function ( item ) {
                    if ( item.value || item.id ) {
                      // IDEA: trigger 'dumbTagAdd' event  here!
                      var tag = item.value.toLowerCase(),
                          tagElms = input.prevAll(cfg.tagSel)
                                      .filter(function () {
                                          var same = $(this).data('dumbTag').tag.toLowerCase() === tag;
                                          if (same) {  delTag(this, true);  } // silently remove existing duplicates
                                          return !same;
                                        });
                      // auto remove the last tag when we've hit the maxTags limit.
                      if ( cfg.maxTags  &&  tagElms.length >= cfg.maxTags ) {
                        delTag( input.prev( cfg.tagSel ), true );
                      }
                      var tagElm = buildTagElms([item]);
                      input.val(''); // empty the field to prevent selection via ENTER
                                     // saving that text as tag.
                      tagElm.trigger('dumbTagAdded');
                    }
                  },

                addCurrentValue = function () {
                    var val = input.val();
                    if ( !cfg.limitVocab  &&  val  &&  !input.autocomplete('widget').find('a.ui-state-hover,a.ui-state-focus')[0] ) {
                      val = $.trim( val.replace(/\s+/g, ' ') );
                      addItem({ value:val });
                    }
                    setTimeout(function () {
                        input.autocomplete('close');
                      }, 0);
                  },

                selectBox;

            if ( input.is('select') ) {
              selectBox = input;
              input = selectBox.siblings('input:text');
              if ( !input[0] ) {
                if ( !('limitVocab' in cfg) ) {
                  cfg.limitVocab = true;
                }
                input = $('<input type="text" />').insertAfter( selectBox );
              }
            }
            else {
              selectBox = input.siblings('select');
            }

            // read prefills (and local values
            selectBox
                .detach()
                .find('option')
                    .each(function () {
                        var elm = $(this),
                            itm = { id:elm.val(),  value:elm.text() };
                        if ( itm.id ) {
                          itm.label = itm.value;
                          acLocalValues.push( itm );
                          if (  elm.is('[selected]') ) {
                            prefills.push({ id:elm.val(),  value:elm.text() } );
                          }
                        }
                      });

            var val = input.attr('value');
            if ( val ) {
              if ( cfg.splitter ) {
                $.each(val.split(cfg.splitter), function (i, val) {
                    val = $.trim( val ).replace(/\s+/g, '');
                    if (val) {
                      prefills.push({ id:val, value:val });
                    }
                  });
              }
              if ( input.val() === val ) {
                input.val('');
              }
            }

            input
                .wrap( cfg.wrapperTempl )
                .parent()// .tagswrap
                    .bind('click', function (e) {
                        // direct clicks to the white background of .tagswrap should move focus to the input
                        if ( e.target === this ) {
                          input.trigger('focus');
                        }
                        // handle clicks on the delete buttons
                        else if ( $(e.target).is( cfg.delSel ) ) {
                          delTag( $(e.target).closest( cfg.tagSel ) );
                          return false;
                        }
                      });

            input
                .data( dataKey, cfg )
                 //Remove the name from the original input to avoid confusion on the final form submit
                .attr('name','')
                .attr( 'autocomplete', 'off' ) // need to do this explictly because of the lazy deployment of the autocomplete functionality (otherwise first contact with the field has autocomplete="on"
                // make the `.tagswrap` respond to focus/blur like an input field
                .bind('focus', function (/*e*/) {
                    clearTimeout( cfg.blurTimeout );
                    $(this.parentNode)
                        .addClass( cfg.focusClass );
                  })
                .one('focus', function (/*e*/) {
                    input
                        .bind('keydown', function (e) {
                            // backspace inside an empty input should delete the last .tag and fill the input with its value
                            if ( !this.value  &&  e.which === 8 ) {
                              var input = $(this);
                              setTimeout(function () {
                                  var prevTagElm = input.prev( cfg.tagSel ),
                                      prevValue = prevTagElm.data('dumbTag').tag;
                                  if ( delTag( prevTagElm ) ) {
                                    input
                                        .val(
                                            cfg.htmlTags ?
                                                prevValue.replace(/<.+?>/g, ''):
                                                prevValue
                                          )
                                        [0].select();
                                  }
                                }, 0);
                            }
                            // enter inside the input-field may create a new tag
                            if ( e.which === 13/* ENTER */ ) {
                              e.preventDefault();
                              addCurrentValue();
                            }
                          })
                        .bind('blur', function (/*e*/) {
                            // add the current value on blur
                            cfg.blurTimeout = setTimeout(function () {
                                addCurrentValue();
                                input
                                    .val('')
                                    .parent()
                                        .removeClass( cfg.focusClass );
                              }, 350); // needs to be long enough delay for people who click slowly
                          });
                    if ( cfg.splitter ) {
                      input
                          .bind('keypress', function (e) {
                              if ( cfg.splitter.test( String.fromCharCode(e.which) ) ) {
                                e.preventDefault();
                                addCurrentValue();
                              }
                            });
                    }
                    if ( cfg.ajax  ||  acLocalValues[0] ) {
                      var minLengthOverride = acLocalValues[0] ? { minLength: 0 } : {};
                      input
                          .autocomplete(
                              $.extend(
                                  {
                                    position:{ of:input.parent() },
                                  },
                                  cfg.acCfg,
                                  minLengthOverride,
                                  {
                                    source:     function (request, callback) {
                                        var term = $.trim( request.term.toLowerCase() ).replace(/\s+/g, ' ');
                                        if ( cfg.ajax  &&  request.term.length >= cfg.acCfg.minLength ) {
                                          if ( cfg.ajaxMethod ) {
                                            cfg.ajaxMethod({
                                                term: term,
                                                input: input,
                                                config: cfg,
                                                callback: callback,
                                              });
                                          }
                                          else {
                                            $.ajax({
                                                url:      acUrl,
                                                type:     cfg.ajaxCfg.type,
                                                data:     acName + '=' + encodeURIComponent( term ),
                                                dataType: cfg.ajaxCfg.dataType,
                                                success:  function (results) {
                                                    if ( cfg.acFixResults ) {
                                                      var newResults = cfg.acFixResults(results);
                                                      results = newResults===undefined ?
                                                                    results:
                                                                    newResults;
                                                    }
                                                    // untangle the naming-conflict coming from the server
                                                    results = $.map(results, function (itm) {
                                                        if ( cfg.acFixItem ) {
                                                          cfg.acFixItem(itm);
                                                        }
                                                        else {
                                                          itm.id =    itm.value;
                                                          itm.value = itm.tag;
                                                        }
                                                        delete itm.tag;

                                                        // Return only items that are not already active (selected)
                                                        // TODO: consider if we need to optionally allow duplicate tags (hasn't come up yet)
                                                        return ( $.inArray( itm.value.toLowerCase(), activeTags ) === -1 ) ?
                                                                    itm:
                                                                    null;
                                                      });
                                                    callback(results);
                                                  },
                                              });
                                          }
                                        }
                                        else {
                                          var res = [],
                                              i = 0,
                                              localItem;
                                          while ( (localItem = acLocalValues[i++]) ) {
                                            var localTag = localItem.label.toLowerCase();
                                            if ( localTag.indexOf( term ) > -1 ) {
                                              if ( $.inArray( localTag, activeTags ) === -1 ) // skip over tags that are already active
                                              {
                                                res.push( localItem );
                                              }
                                            }
                                          }
                                          callback( res );
                                        }
                                      },
                                  }
                                )
                            )
                          .one('autocompleteopen', function (/*e, ui*/) {
                              input.autocomplete('widget').attr( 'class', cfg.acMenuClass);
                            })
                          .bind('autocompleteopen', function (/*e, ui*/) {
                              input.autocomplete('widget').width( input.parent().outerWidth() );
                            })
                          // prevent focus-ing an item in the ac-menu updating the input field.
                          .bind('autocompletefocus', function (/*e, ui*/) {
                              return false;
                            })
                          .bind('autocompleteselect', function (e, ui) {
                              addItem(ui.item);
                              if ( cfg.reShowLocals ) {
                                setTimeout(function () {  input.autocomplete('search');  }, 100);
                              }
                              input.blur(); // Without blur users need to click outside the input and back in to get the dropdown.
                              return false; // prevent autocomplete from filling the input field with the selected value.
                            });

                      if ( !cfg.acCfg.minLength  ||  cfg.showLocals ) {
                        input
                            .bind('focus', function (/*e*/) {
                                input.autocomplete('search');
                              })
                            .autocomplete('search'); // do it now, because we're inside a .one()-off focus handler, remember? :-)
                      }
                    }
                  });

            buildTagElms(prefills);

            prefills = selectBox = undefined;
          });
      }

      return this;
    };

  dumbTags.defaults = {
      //maxTags:      null   // Number - maximum number of tags at a time
      i18n: {
          en: {
              delTitle:  'Remove this value',
              delLabel:  'x',
            },
          is: {
              delTitle:  'Eyða þessu gildi',
              delLabel:  'x',
            },
        },
      //limitVocab:   false,  // Boolean - indicates whether only a limited set of values can be chosen from - or if free-form tagging is allowed.
      wrapperTempl: '<span class="tagswrap"/>',
      disabledClass: 'disabled',
      tagTempl:     '<span class="tag"/>',
      //htmlTags:     false,                            // allows item.value to contain HTML to be displayed inside the tag...
      //processTag:   function ( $tagElm, acItem ) {},  // allows customization of the tagElm's content and className - before the delete-button and input field are injected.
      tagDelTempl:  '<a href="#" class="del">x</a>',
      focusClass:   'focused',
      tagSel:       '.tag',
      delSel:       'a.del',
      splitter:     /,|;/, // Regexp
      ajax:           true,  // Flags whether to use ajax to fill the autocomplete menu, or with local (<select> box) values only.
      showLocals:   true,  // controls wheter local values are shown instantly on focus.
      //reShowLocals: false, // controls wheter to show the local-values again every time a tag is added
      //ajaxMethod:   null,  // Function(options{term: input: config: callback: }) - allows overriding the built-in jQuery ajax request mechanism with custom behavior (e.g. DWR method calls, etc.);
      //acUrl:        null,  // String - overriding URL for the autocomplete ajax call. Defaults to picking up hints from cfg.acNameAttr attributes in the dom, or the form[action]
      //acName:       null   // String - parameter name for the autocomplete ajax call. Defaults to to using the name="" of the input field.
      acUrlAttr:    'data-suggesturl',
      acNameAttr:   'data-acname',
      acMenuClass:  'tags-acmenu ui-autocomplete ui-menu',
      acCfg: {
          minLength:  2,
          //autoFocus:  false,
          delay:      300,
          //position:   { of:input.parent() },
          html:       true,
        },
      //acFixResults:  null  // Function(ajaxResults) - may either modify ajaxResults (if it's an object) or return a completely new results
      //acFixItem:     null  // Function(item) - custom function for manipulating each incoming ac item (useful for mapping conflicting json values)
      ajaxCfg: {
          //type: 'GET'
          dataType: 'json',
        },
    };


})(jQuery);
