// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.dumbTags v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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
(function($){


  var dumbTags = $.fn.dumbTags = function (options) {

      this.each(function (e) {
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
                              tag:   itm.value            // human readable tag "name"
                            },
                          tagElm = $(cfg.tagTempl );

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
                                      value: tagItem.value
                                    })
                            )
                          .append(
                              $( cfg.tagDelTempl )
                                  .attr( 'title', i18n.delTitle||i18n.delLabel )
                                  .html( i18n.delLabel )
                            );

                      activeTags.push( tagItem.tag.toLowerCase() );
                      tagElms.push( tagElm[0] );
                    });
                  return $(tagElms).insertBefore( input );
                },
              addItem = function ( item ) {
                  // IDEA: trigger 'dumbTagAdd' event  here!
                  var tag = item.value.toLowerCase(),
                      tagElms = input.prevAll(cfg.tagSel)
                                  .filter(function(){
                                      var same = $(this).data('dumbTag').tag.toLowerCase() == tag;
                                      if (same) {  delTag(this, true);  } // silently remove existing duplicates
                                      return !same;
                                    });
                  // auto remove the last tag when we've hit the maxTags limit.
                  if ( cfg.maxTags  &&  tagElms.length >= cfg.maxTags )
                  {
                    delTag( input.prev( cfg.tagSel ), true );
                  }
                  var tagElm = buildTagElms([item]);
                  input.val(''); // empty the field to prevent selection via ENTER saving that text as tag.
                  tagElm.trigger('dumbTagAdded');
                },

              delTag = function ( tagElm, autoDelete ) {
                  tagElm = $(tagElm);
                  var removeEv = $.Event('dumbTagRemove');
                  removeEv.autoDelete = autoDelete;
                  tagElm.trigger(removeEv);
                  if ( autoDelete  ||  !removeEv.isDefaultPrevented() )
                  {
                    var pos = $.inArray( tagElm.data('dumbTag').tag.toLowerCase(), activeTags );
                    if ( pos > -1 )
                    {
                      activeTags.splice( pos , 1);
                    }
                    tagElm.remove();
                    // IDEA: trigger 'dumbTagRemoved' event  here!
                    return true;
                  }
                  return false;
                },

              selectBox;

          cfg.splitter = cfg.splitter || ',';

          if ( input.is('select') )
          {
            if ( !('limitVocab' in cfg) )
            {
              cfg.limitVocab = true;
            }
            selectBox = input;
            input = $('<input type="text" />').insertAfter( selectBox );
          }
          else
          {
            selectBox = input.siblings('select');
          }

          // read prefills (and local values
          selectBox
              .detach()
              .find('option')
                  .each(function () {
                      var elm = $(this);
                      if ( !cfg.ajax )
                      {
                        itm = { id:elm.val(),  value:elm.text() };
                        itm.label = itm.value;
                        acLocalValues.push( itm );
                      }
                      if ( elm.is('[selected]') )
                      {
                        prefills.push({ id:elm.val(),  value:elm.text() } );
                      }
                    });

          var val = input.attr('value');
          if ( val )
          {
            $.each(val.split(cfg.splitter), function (i, val) {
                val = $.trim( val ).replace(/\s+/g, '');
                if (val)
                {
                  prefills.push({ id:val, value:val });
                }
              });
            if ( input.val() == val )
            {
              input.val('');
            }
          }
          input
               //Remove the name from the original input to avoid confusion on the final form submit
              .attr('name','')
              .wrap( cfg.wrapperTempl )
              .parent()// .tagswrap
                  .bind('click', function (e) {
                      // direct clicks to the white background of .tagswrap should move focus to the input
                      if ( e.target == this )
                      {
                        input.trigger('focus');
                      }
                      // handle clicks on the delete buttons
                      else if ( $(e.target).is( cfg.delSel ) )
                      {
                        delTag( $(e.target).closest( cfg.tagSel ) );
                        return false;
                      }
                    })
              .end()
              .attr( 'autocomplete', 'off' ) // need to do this explictly because of the lazy deployment of the autocomplete functionality (otherwise first contact with the field has autocomplete="on"
              // make the `.tagswrap` respond to focus/blur like an input field
              .bind('focus', function (e) {
                  $(this)
                      .parent()
                          .addClass( cfg.focusClass );
                })
              .one('focus', function (e) {
                  input
                      .bind('keydown', function (e) {
                          // backspace inside an empty input should delete the last .tag and fill the input with its value
                          if ( !this.value  &&  e.which == 8 )
                          {
                            var input = $(this);
                            setTimeout(function(){
                                var prevTagElm = input.prev( cfg.tagSel ),
                                    prevValue = prevTagElm.data('dumbTag').tag;
                                if ( delTag( prevTagElm ) )
                                {
                                  input
                                      .val( prevValue )
                                      [0].select();
                                }
                              }, 0);
                          }
                          // enter (or comma) inside the input-field may create a new tag
                          else if ( e.which == 13/* ENTER */ || e.which == 44/* , */ )
                          {
                            if ( !cfg.limitVocab  &&  this.value )
                            {
                              var val = $.trim( this.value.replace(/\s+/g, ' ') );
                              addItem({ value:val });
                            }
                            $(this).autocomplete('close');
                            return false;
                          }
                        })
                      .bind('blur', function (e) {
                          $(this)
                              .val('')
                              .parent()
                                  .removeClass( cfg.focusClass );
                        });
                  if ( cfg.ajax  ||  acLocalValues.length )
                  {
                    if ( !cfg.ajax )
                    {
                      cfg.acCfg.minLength = 0;
                    }
                    input
                        .autocomplete(
                            $.extend(
                                {
                                  position:{ of:input.parent() }
                                },
                                cfg.acCfg,
                                {
                                  source:     function(request, callback){
                                      var term = $.trim( request.term.toLowerCase() ).replace(/\s+/g, ' ');
                                      if ( cfg.ajax )
                                      {
                                        if ( cfg.ajaxMethod )
                                        {
                                          cfg.ajaxMethod({
                                              term: term,
                                              input: input,
                                              config: cfg,
                                              callback: callback
                                            });
                                        }
                                        else
                                        {
                                          $.ajax({
                                              url:      acUrl,
                                              type:     cfg.ajaxCfg.type,
                                              data:     acName + "=" + encodeURIComponent( term ),
                                              dataType: cfg.ajaxCfg.dataType,
                                              success:  function (results) {
                                                  if ( cfg.acFixResults )
                                                  {
                                                    var newResults = cfg.acFixResults(results);
                                                    results = newResults===undefined ?
                                                                  results:
                                                                  newResults;
                                                  }
                                                  // untangle the naming-conflict coming from the server
                                                  results = $.map(results, function (itm, i) {
                                                      if ( cfg.acFixItem )
                                                      {
                                                        cfg.acFixItem(itm);
                                                      }
                                                      else
                                                      {
                                                        itm.id =    itm.value;
                                                        itm.value = itm.tag;
                                                      }
                                                      delete itm.tag;

                                                      // Return only items that are not already active (selected)
                                                      // TODO: consider if we need to optionally allow duplicate tags (hasn't come up yet)
                                                      return ( $.inArray( itm.value.toLowerCase(), activeTags ) == -1 ) ?
                                                                  itm:
                                                                  null;
                                                    });
                                                  callback(results);
                                                }
                                            });
                                        }
                                      }
                                      else
                                      {
                                        var res = [],
                                            i = 0,
                                            localItem;
                                        while ( (localItem = acLocalValues[i++]) )
                                        {
                                          var localTag = localItem.label.toLowerCase();
                                          if ( localTag.indexOf( term ) > -1 )
                                          {
                                            if ( $.inArray( localTag, activeTags ) == -1 ) // skip over tags that are already active
                                            {
                                              res.push( localItem );
                                            }
                                          }
                                        }
                                        callback( res );
                                      }
                                    }
                                }
                              )
                          )
                        .one('autocompleteopen', function (e, ui) {
                            input.autocomplete('widget').attr( 'class', cfg.acMenuClass);
                          })
                        .bind('autocompleteopen', function (e, ui) {
                            input.autocomplete('widget').width( input.parent().outerWidth() );
                          })
                        // prevent focusing an item in the ac-menu updating the input field.
                        .bind('autocompletefocus', function (e, ui) {
                            return false;
                          })
                        .bind('autocompleteselect', function (e, ui) {
                            addItem(ui.item);
                            if ( !cfg.acCfg.minLength )
                            {
                              setTimeout(function(){  input.autocomplete('search');  }, 100);
                            }
                            return false; // prevent autocomplete from filling the input field with the selected value.
                          });

                    if ( !cfg.acCfg.minLength )
                    {
                      input
                          .bind('focus', function (e) {
                              input.autocomplete('search');
                            })
                          .autocomplete('search'); // do it now, because we're inside a .one()-off focus handler, remember? :-)
                    }
                  }
                });

          buildTagElms(prefills);

          prefills = selectBox =
              undefined;
        });

      return this;
    };

  dumbTags.defaults = {
      //maxTags:      null   // Number - maximum number of tags at a time
      i18n: {
          en: {
              delTitle:  'Remove this value',
              delLabel:  'x'
            },
          is: {
              delTitle:  'Eyða þessu gildi',
              delLabel:  'x'
            }
        },
      //limitVocab:   false,  // Boolean - indicates whether only a limited set of values can be chosen from - or if free-form tagging is allowed.
      wrapperTempl: '<span class="tagswrap"/>',
      tagTempl:     '<span class="tag">',
      //htmlTags:     false,                            // allows item.value to contain HTML to be displayed inside the tag...
      //processTag:   function ( $tagElm, acItem ) {},  // allows customization of the tagElm's content and className - before the delete-button and input field are injected.
      tagDelTempl:  '<a href="#" class="del">x</a>',
      focusClass:   'focused',
      tagSel:       '.tag',
      delSel:       'a.del',
      //splitter:     ',',
      ajax:         true,  // Flags whether to use ajax to fill the autocomplete menu, or with local (<select> box) values only.
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
          html:       true
        },
      //acFixResults:  null  // Function(ajaxResults) - may either modify ajaxResults (if it's an object) or return a completely new results
      //acFixItem:     null  // Function(item) - custom function for manipulating each incoming ac item (useful for mapping conflicting json values)
      ajaxCfg: {
          //type: 'GET'
          dataType: 'json'
        }
    };


})(jQuery);
