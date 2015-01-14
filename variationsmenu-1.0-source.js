/* jQuery.fn.variationsMenu 1.0 -- (c) 2012-2015 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// jQuery.fn.variationsMenu v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012-2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  Splits a simple productVariations select box into friendly menus for each variation attribute
//  (plugs neatly into the Eplica product markup pattern.)
//
//  Depends on:
//    jQuery 1.7
//

(function($){

  // returns the first variation that matches all of the selectedTags
  var deriveSelectedVariation = function ( activeTagIdx, allVariations, selectedTags, doFuzzyMatch ) {
          var selectedTagsSplat = selectedTags.join('|');
          var selectedVariation;
          var i = 0;
          var variation;
          while ( (variation = allVariations[i++]) )
          {
            var isFuzzySameEnough = doFuzzyMatch  &&  selectedTags[activeTagIdx] === variation[activeTagIdx];
            var isExactSame = !isFuzzySameEnough  &&  variation.join('|') === selectedTagsSplat;
            if ( isFuzzySameEnough || isExactSame ) {
              selectedVariation = variation;
              break;
            }
          }
          return selectedVariation;
        };


  // returns the values available for tag tagIdx, for a given activeTagdIdex
  var deriveAvailableValues = function ( allVariations, selectedTags ) {
          var available = [];
          var numTags = selectedTags.length;
          var tagIdx = -1;
          // for each tag/type (i.e. color, size, etc.)
          while ( ++tagIdx< numTags )
          {
            var availableVals = available[tagIdx] = {};

            var numVars = allVariations.length;
            var varIdx = -1;
            while ( ++varIdx < numVars )
            {
              var variation = allVariations[varIdx];
              var i = -1;
              while ( ++i < numTags )
              {
                if ( i !== tagIdx  &&  selectedTags[i]!=null  &&  variation[i] !== selectedTags[i] )
                {
                  variation = null; // reject this variation since it doesn't match on all non-tagIdx tags
                  break;
                }
              }
              if ( variation )
              {
                availableVals[ variation[tagIdx] ] = true;
              }
            }
          }
          return available;
        };


  var updateMenus = function ( menuElms, activeTagIdx, enabledOptions, selectedTags, cfg, txt ) {
            $(menuElms).each(function (i) {
                var menuElm = $(this);
                var enabledVals = enabledOptions[i];

                menuElm
                    .toggleClass( cfg.lastMenuClass, i===activeTagIdx );

                menuElm.data('varMenuItems')
                    .each(function () {
                        var menuItemElm = this;
                        var menuItem = $(menuItemElm);
                        var itemValue = menuItem.data('varValue');
                        var isUnavailable = !enabledVals[ itemValue ];
                        var isCurrent = itemValue === selectedTags[i];

                        menuItem
                            .data( 'varDisabled', isUnavailable )
                            .toggleClass( cfg.disabledClass, isUnavailable )
                            .toggleClass( cfg.currentClass, isCurrent )
                            .attr('title', menuItemElm.orgTitle + (isUnavailable?' '+txt.unavail:'') );
                        menuItem.find('input')[0].checked = isCurrent;
                      });
              });
          };



  $.fn.variationsMenu = function ( cfg ) {
      cfg = $.extend({
                imgCont:        '.imagelist',  // (global) Selector or Element
                // variationsImages: {
                //     // ...custom config for $.fn.variationsImages()
                // },
                tagJoint:       ' - ',
                wrapper:        '<fieldset class="variationsmenu"><i headline/><i menus/></fieldset>',
                wrapperHl:      '<h3/>',
                menuTmpl:       '<fieldset class="fi_rdo req"><h4>{legend}</h4><ul><li items/></ul></fieldset>',
                menuItem:       '<li class="{value}"><input type="radio" name="{tagname}" value="{value}" id="{id}" /><label for="{id}">{label}</label></li>',
                //itemBuilder:    function($itemElm, tagname, tagData, value, label) { /* play with the $itemElm, or (optionally) return a new one (as jQuery collection) */ },
                emptyLabel:     '- - -',
                currentClass:   'current',
                lastMenuClass:  'activemenu',
                i18n:           {
                    is:{ unavail:'(Samsetning ekki til)' },
                    en:{ unavail:'(Combination unavailable)' }
                  },
                disabledClass:  'disabled',
                autoSelect:     'aggressive', // 'soft', falsy

                priceElm: function (cont) { // priceElm is function or element or selector
                    return cont.closest('form').parent().find('.price');
                  },
                defaultPrice: function ( priceElm ) {
                    return priceElm.find('b')[0].firstChild.nodeValue;
                  },
                updatePrice: function ( priceElm, priceNormal, priceOffer ) {
                    // TODO: make all this more generic, configurable
                    //       and/or less of a mess.
                    var protoPrice = priceElm.data('prototype');
                    if ( !protoPrice )
                    {
                      protoPrice = priceElm.children('del').addBack().last().contents().detach();
                      protoPrice.filter('b').contents().eq(0).replaceWith('<span class="price__value"/>');
                      priceElm.data( 'prototype', protoPrice );
                    }

                    priceElm.empty();
                    if ( priceOffer )
                    {
                      protoPrice.clone()
                          .appendTo( priceElm )
                          .wrap('<del/>');
                      priceElm.find('del .price__value')
                          .replaceWith( priceNormal );
                      protoPrice.clone()
                          .appendTo( priceElm )
                          .wrap('<ins/>');
                      priceElm.find('ins .price__value')
                          .replaceWith( priceOffer );
                      var discountLabel = priceElm.attr('data-offerlabel');
                      if ( discountLabel )
                      {
                        priceElm.find('ins strong').text( discountLabel );
                      }
                    }
                    else
                    {
                      protoPrice.clone()
                          .appendTo( priceElm );
                      priceElm.find('.price__value')
                          .replaceWith( priceNormal );
                    }
                  },
                unknownPrice: '--'

              }, cfg);


      var wrappers = [];

      this.each(function () {
          var cont = $(this);
          var select = cont.find('select');
          var headline = cont.find('label').contents();
          var rnd = (new Date()).getTime();

          var txt = cfg.i18n[cont.closest('[lang]').attr('lang')] || cfg.i18n.en;

          // hidden input that carries the value of the selectbox
          var hiddenInput = $('<input type="hidden" />').attr({ name:select[0].name });

          var imgCont = ( cfg.imgCont  &&  $.fn.variationsImages ) ?
                            $( cfg.imgCont ).variationsImages( cfg.variationsImages ):
                            null;

          var tagnames = (select.attr('data-tagnames')||'').split('|');
          var taglabels = (select.attr('data-taglabels')||'').split('|');
          var numTags = tagnames.length;
          var tagTextSplitter = new RegExp('\\s*'+(select.attr('data-tagjoint')||cfg.tagJoint) +'\\s*' );

          // list of available variationObjects
          var variations = [/*  [ 'id':variationId, 0:tag1value, 1:tag2value, ... ],  [... */];

           // map of tag types, their legend text and a list of unique values. (used to build the menus)
          var tags =  $.map(tagnames, function (name, i) {
                          return { name:tagnames[i],  legend:taglabels[i],  vals:{/*  value1Name:value1Label, ... */}, tagData:{/*  value1Name:value1tagData, ... */} };
                        });

          // the currently selected variationObject
          var selectedVariation; // the actual variations object (tag value list) that is currently selected. May be null.

          var selectedTags = new Array(numTags); // list of currently selected tags - may be empty or incomplete.

          var priceElm;
          var defaultPrice;
          if ( select.is('[data-hasprice]') )
          {
            priceElm = $( cfg.priceElm.apply ? cfg.priceElm( cont ) : cfg.priceElm );
            defaultPrice = cfg.defaultPrice( priceElm );
          }


          // (Before we harvest - remove empty options so single-option elements get autoselected)
          cfg.autoSelect  &&  select.children().filter(function(){ return !$(this).attr('value'); }).remove();
          // Harvest data from inside the select box and store it in `variations` and `tags`
          select.children(/*'option'*/).each(function(){
              var optElm = $(this),
                  variationId = optElm.attr('value');
              if ( variationId )
              {
                var vals = optElm.attr('data-tags').split('|');
                var tagData = optElm.attr('data-tagdata');
                var selected = optElm.is(':selected');
                var varObj = [];
                var text = optElm.text();
                if ( priceElm )
                {
                  var priceRe = /\s+\(([^\(\)]+?)\)\s*$/;
                  var priceMatch = text.match(priceRe);
                  if ( priceMatch )
                  {
                    text = text.replace(priceRe, '');
                    var price = document.createTextNode( priceMatch[1] );
                    var beforePrice = optElm.attr('data-beforeprice');
                    varObj.price = beforePrice || price;
                    varObj.priceOffer = beforePrice ? price : '';
                  }
                }
                text = text.split(tagTextSplitter);
                tagData = tagData ? tagData.split('|') : [];

                varObj.id = variationId;
                for (var n=0; n<numTags; n++)
                {
                  var val = vals[n]||'';
                  varObj.push( val );
                  tags[ n ].vals[ val ] = text[n] || cfg.emptyLabel;
                  tags[ n ].tagData[ val ] = tagData[ n ];
                  selected  &&  (selectedTags[n] = val);
                }
                if ( selected )
                {
                  selectedVariation = varObj;
                }
                variations.push( varObj );
              }
            });



          // Handle sloppy/weird product registration:
          // if product only a single variation and no tags/attributes (i.e. if its data-tags="" is empty)
          if ( variations.length === 1   &&  !(variations[0]||[]).join('') )
          {
            hiddenInput
                .val( variations[0].id )
                .replaceAll( cont );
            return;
          }

          // build the menus from the information stored in `tags`
          var menus = $.map(tags, function (t, i) {
                  var menuElm = $( cfg.menuTmpl.replace(/\{legend\}/g, t.legend) )
                                    .addClass( t.name );
                  var count = 0;
                  var menuItems = $.map(t.vals, function (label, value) {
                          var itemHTML =  cfg.menuItem
                                              .replace(/\{id\}/g,     t.name+rnd+'-'+ (count++) )
                                              .replace(/\{tagname\}/g, t.name+rnd)
                                              .replace(/\{label\}/g,   label)
                                              .replace(/\{value\}/g,   value);
                          var item =  $( itemHTML )
                                          .data('varValue', value);
                          if ( cfg.itemBuilder )
                          {
                            item = cfg.itemBuilder(item, t.name, t.tagData[value], value, label)  ||  item;
                          }
                          item[0].orgTitle = label;
                          return item[0];
                        });
                  menuItems = $(menuItems);

                  menuItems
                      .on('click.variationmenu', function (e, isFirstRun) {
                          var clickedLi = $(this);
                          var isChanged = clickedLi.data('varValue') !== selectedTags[i];

                          // only preventDefault on link clicks. radio-input clicks shouldn't be touched
                          if ( $(e.target).closest('[href]', clickedLi)[0] )
                          {
                            e.preventDefault();
                          }

                          // only mark the item as .current and update the enabled/disabled states
                          // on real clicks (!isFirstRun) or if the targetItem is preselected on page load (current)
                          if ( !isFirstRun )
                          {
                            // if the user clicked a disabled option - then we reset the whole selection.
                            if ( clickedLi.data('varDisabled') )
                            {
                              selectedTags = new Array(numTags);
                            }
                            // update selectedTags info
                            selectedTags[i] = clickedLi.data('varValue');
                            // derive the new selectedVariation
                            selectedVariation = deriveSelectedVariation( i, variations, selectedTags );

                            if ( !selectedVariation  &&  cfg.autoSelect==='aggressive' )
                            {
                              // Force closest/fuzzy match
                              selectedVariation = deriveSelectedVariation( i, variations, selectedTags, true );
                              // Update selectedTags based on the new selectedVariation
                              selectedTags = [].concat(selectedVariation);
                            }
                          }

                          if ( priceElm )
                          {
                            var price = selectedVariation ?
                                            (selectedVariation.price || defaultPrice):
                                            cfg.unknownPrice;
                            var priceOffer = selectedVariation  && selectedVariation.priceOffer;
                            cfg.updatePrice( priceElm, price, priceOffer );
                          }

                          if ( isChanged || isFirstRun )
                          {
                            var enabledOptions = deriveAvailableValues( variations, selectedTags );
                            updateMenus( menus, i, enabledOptions, selectedTags, cfg, txt );

                            clickedLi.trigger( 'variationchanged', [selectedVariation, t.name, selectedTags[i]] );
                            hiddenInput
                                .val( selectedVariation ? selectedVariation.id : '' )
                                .trigger('change');
                            imgCont  &&  imgCont.trigger('variationchanged', [selectedVariation && selectedVariation.id]);
                          }

                        });
                  menuElm
                      .data( 'varMenuItems', menuItems )
                      .find('[items]')
                          .replaceWith( menuItems );
                  return menuElm.toArray();
                });


          var wrapper = $(cfg.wrapper);
          wrappers.push(wrapper[0]);
          wrapper
              .find( '[headline]' )
                  .replaceWith(  $( cfg.wrapperHl ).append( headline )  )
              .end()
              .find('[menus]')
                  .replaceWith( menus )
              .end()
              .replaceAll( cont );
          hiddenInput
              .insertAfter( wrapper );

          $(menus[0]).data('varMenuItems')
              .filter(function () {
                  return $(this).data('varValue') === selectedTags[0];
                })
                  .triggerHandler('click.variationmenu', [true]);

          // Release memory (GC)
          tagnames =
          taglabels =
          tagTextSplitter =
          tags =
          cont =
          select =
          headline =
          rnd =
          wrapper =
              undefined;
        });

      return this.pushStack( wrappers );
    };

})(jQuery);