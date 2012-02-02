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

  TODO: Wite proper documentation...

*/
(function($){

  
  var dumbTags = $.fn.dumbTags = function (options) {

      this.each(function (e) {
          var input = $(this),
              cfg  = $.extend(true, {}, dumbTags.defaults, options );
              lang = input.closest('[lang]').attr('lang').substr(0.2),
              i18n = $.extend({}, cfg.i18n[lang]||cfg.i18n.en, cfg.texts );
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

              buildTagElms = function (items) {
                  var tagElms = [];
                  $.each(items, function (i, itm) {
                      tagElms.push(
                          $(cfg.tagTempl )
                              .text( itm.value )
                              .append( $('<input type="hidden"/>').attr({ name:submName, value:itm.id }) )
                              .append( $( cfg.tagDelTempl ).attr( 'title', i18n.delTitle||i18n.delLabel ).html( i18n.delLabel ) )
                              .attr( 'title', itm.value )
                              [0]
                        );
                    });
                  return tagElms;
                };

          // read prefills (and local values
          input.siblings('select')
              .detach()
              .find('option')
                  .each(function () {
                      var elm = $(this);
                      if ( !cfg.ajax )
                      {
                        item = { id:elm.val(),  value:elm.text() };
                        item.label = item.value;
                        acLocalValues.push( item );
                      }
                      if ( elm.is('[selected]') )
                      {
                        prefills.push({ id:elm.val(),  value:elm.text() } );
                      }
                    });

          var val = input.attr('value');
          if ( val ) {
            if ( input.val() == val ) {
              input.val('');
            }
            prefills.push({ id:val, value:val });
          }
          input
               //Remove the name from the original input to avoid confusion on the final form submit
              .attr('name','')
              .wrap( cfg.wrapperTempl )
              .parent()
                  .prepend( buildTagElms(prefills) )
              .end()
              .bind('keypress', function (e) {
                  // backspace inside an empty input should delete the last .tag and fill the input with its value
                  if ( !this.value  &&  e.which == 8 )
                  {
                    var input = $(this);
                    setTimeout(function(){
                        var prevTag = input.prev( cfg.tagSel ),
                            prevValue = prevTag.attr('title');
                        prevTag.find( cfg.delSel ).trigger('click');
                        input.val( prevValue );
                        input[0].select();
                      }, 0);
                  }
                })
              // make the `.tagswrap` respond to focus/blur like an input field
              .bind('focus', function (e) {
                  $(this)
                      .parent()
                          .addClass( cfg.focusClass );
                })
              .bind('blur', function (e) {
                  $(this)
                      .val('')
                      .parent()
                          .removeClass( cfg.focusClass );
                })
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
                        $(e.target).closest( cfg.tagSel ).remove();
                        return false;
                      }
                    })
              .end()
              .autocomplete(
                  $.extend(
                      {
                        position:{ of:input.parent(), offset:'0 18' } // FIXME: offset position should not be set here (problems with position: absolute; in jQuery UI Autocomplete)
                      },
                      cfg.acCfg,
                      {
                        minLength:  cfg.ajax ? cfg.acCfg.minLength : 0,
                        source:     function(request, callback){
                            var term = $.trim( request.term.toLowerCase() ).replace(/\s+/g, ' ');
                            if ( cfg.ajax )
                            {
                              $.ajax({
                                  url:      acUrl,
                                  type:     cfg.ajaxCfg.type,
                                  data:     acName + "=" + encodeURIComponent( term ),
                                  dataType: cfg.ajaxCfg.dataType,
                                  success:  function (results) {
                                      if ( cfg.acFixResults ) {
                                        results = cfg.acFixResults(results);
                                      }
                                      // untangle the naming-conflict coming from the server
                                      $.each(results, function (i, item) {
                                          if ( cfg.acFixItem )
                                          {
                                            cfg.acFixItem(item);
                                          }
                                          else
                                          {
                                            item.id =    item.value;
                                            item.value = item.tag;
                                          }
                                          delete item.tag;
                                        });
                                      callback(results);
                                    }
                                });
                            }
                            else
                            {
                              var res = [];
                                  i = 0;
                              while ( acLocalValues[i] )
                              {
                                if ( acLocalValues[i].label.toLowerCase().indexOf( term ) > -1 )
                                {
                                  res.push( acLocalValues[i] );
                                }
                                i++;
                              }
                              callback( res );
                            }
                          }
                      }
                    )
                )
              .bind('autocompleteopen', function (e, ui) {
                  input.autocomplete('widget')
                      .attr( 'class', cfg.acMenuClass)
                      .width( input.parent().outerWidth() );
                })
              // FIXME: needs documentation/explanation/review  (man ekki í svipinn hvað þetta gerir)
              .bind('autocompletefocus', function (e, ui) {
                  return false;
                })
              .bind('autocompleteselect', function (e, ui) {
                  setTimeout(function(){
                      // auto remove the last tag when we've hit the maxTags limit.
                      if ( cfg.maxTags  &&  cfg.maxTags == input.prevAll(cfg.tagSel).length )
                      {
                        input.prev( cfg.tagSel ).remove();
                      }
                      input
                          .before( buildTagElms([ui.item]) )
                          .val('');
                    }, 0);
                });

          prefills = undefined;
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
      //texts:        null   // Object { delTitle:'foo', delLabel:'bar' } with custom texts for ad-hoc overriding of the dumbTags.i18n[lang] values
      wrapperTempl: '<span class="tagswrap"/>',
      tagTempl:     '<span class="tag">',
      tagDelTempl:  '<a href="#" class="del">x</a>',
      focusClass:   'focused',
      tagSel:       '.tag',
      delSel:       'a.del',
      ajax:         1,  // Flags whether to use ajax to fill the autocomplete menu, or with local (<select> box) values only.
      //acUrl:        null,  // String - overriding URL for the autocomplete ajax call. Defaults to picking up hints from cfg.acNameAttr attributes in the dom, or the form[action]
      //acName:       null   // String - parameter name for the autocomplete ajax call. Defaults to to using the name="" of the input field.
      acUrlAttr:    'data-suggesturl',
      acNameAttr:   'data-acname',
      acMenuClass:  'tags-acmenu ui-autocomplete ui-menu',
      acCfg: {
          minLength:  2,
          autoFocus:  true,
          delay:      300,
          //position:   { of:input.parent() },
          html:       true
        },
      //acFixResults:  null  // Function(ajaxResults) - must return an Array of Objects (just like $.getJSON results would look like)
      //acFixItem:     null  // Function(item) - custom function for manipulating each incoming ac item (useful for mapping conflicting json values)
      ajaxCfg: {
          //type: 'GET'
          dataType: 'json'
        }
    };

            
})(jQuery);
