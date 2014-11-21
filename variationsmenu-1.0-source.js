/* $.fn.variationsMenu 1.0 -- (c) 2012-2013 Hugsmiðjan ehf.  @preserve */

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
  var deriveSelectedVariation = function ( allVariations, selectedTags ) {
          var selectedVariation;
          var l = allVariations.length;
          var i = -1;
          varsLoop:while ( ++i < l )
          {
            var variation = allVariations[i];
             var n = variation.length;
             var k = -1;
            while ( ++k < n )
            {
              if ( variation[k] !== selectedTags[k] )
              {
                continue varsLoop;
              }
            }
            // Note: We only ever reach this point if all the variations tagValues match the ones in selectedTags
            selectedVariation = variation;
            break;
          }
          return selectedVariation;
        };

  // returns the values available for tag tagIdx, for a given activeTagdIdex
  var deriveAvailableValues = function (tagIdx, activeTagIdx, allVariations, selectedTags) {
          var availableVals = {};
          var l = allVariations.length;
          var i = 0;
          while ( i < l )
          {
            // for each variation (i.e. `['blue','xl','banana']`)
            var variation = allVariations[i++];
            if ( variation[activeTagIdx] === selectedTags[activeTagIdx] )
            {
              availableVals[ variation[tagIdx] ] = true;
            }
          }
          return availableVals;
        };

  var highlightSelectedItem = function (menuElm, cfg) {
          var selectedItem = $( menuElm.data( 'varSelectedItem' ) );
          selectedItem
              .addClass( cfg.currentClass )
              .find('input')
                  .prop('checked', true)
                  .attr('title', selectedItem.orgTitle);
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
                priceElm: function (cont) { // function or element or selector
                              return cont.closest('form').parent().find('.price b');
                            },
                defaultPrice:   '--',
                disabledClass:  'disabled',
                autoSelect:     true
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

          // the currently selected variationObject
          var selectedVariation; // the actual variations object (tag value list) that is currently selected. May be null.

          var selectedTags = [/* tag1value, tag2value, ... */];  // list of currently selected tags - may be empty or incomplete.

           // map of tag types, their legend text and a list of unique values. (used to build the menus)
          var tags =  $.map(tagnames, function (name, i) {
                          return { name:tagnames[i],  legend:taglabels[i],  vals:{/*  value1Name:value1Label, ... */}, tagData:{/*  value1Name:value1tagData, ... */} };
                        });

          var priceElm = select.is('[data-hasprice]') ?
                            $(cfg.priceElm.apply ? cfg.priceElm( cont ) : cfg.priceElm ):
                            null;
          var defaultPrice = cfg.defaultPrice!=null ? cfg.defaultPrice : priceElm  &&  priceElm[0].firstChild;


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
                if ( priceElm ) {
                  var priceRe = /\s+\(([^\(\)]+?)\)\s*$/;
                  var priceMatch = text.match(priceRe);
                  if ( priceMatch ) {
                    varObj.price = document.createTextNode( priceMatch[1] );
                    text = text.replace(priceRe, '');
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
                                                      .replace(/\{value\}/g,   value),
                                      item =  $( itemHTML )
                                                  .data('varValue', value),
                                      selected = (value === selectedTags[i]);
                                  if ( selected )
                                  {
                                    menuElm.data( 'varSelectedItem', item[0] );
                                  }
                                  if ( cfg.itemBuilder )
                                  {
                                    item = cfg.itemBuilder(item, t.name, t.tagData[value], value, label)  ||  item;
                                  }
                                  item[0].orgTitle = label;
                                  return item[0];
                                });

                  highlightSelectedItem(menuElm, cfg);

                  menuItems = $(menuItems)
                              .on('click.variationmenu', function (e, isFirstRun) {
                                  var clickedLiElm = this;
                                  var clickedLi = $(clickedLiElm);
                                  var selectedItem = menuElm.data('varSelectedItem');
                                  var isChanged = selectedItem !== clickedLiElm;

                                  // only mark the item as .current and update the enabled/disabled states
                                  // on real clicks (!isFirstRun) or if the targetItem is preselected on page load (current)
                                  if ( !isFirstRun )
                                  {
                                    // only preventDefault on link clicks. radio-input clicks shouldn't be touched
                                    if ( $(e.target).closest('[href]', clickedLiElm)[0] )
                                    {
                                      e.preventDefault();
                                    }

                                    if ( isChanged )
                                    {
                                      // unmark current state of the previously selectedItem
                                      $(selectedItem)
                                          .removeClass( cfg.currentClass );
                                      // update selectedItem
                                      selectedItem = clickedLiElm;
                                      menuElm
                                          .data( 'varSelectedItem', selectedItem );

                                      // if the user clicked a disabled option - then we reset the whole selection.
                                      if ( clickedLi.data('varDisabled') )
                                      {
                                        selectedTags = [];
                                      }
                                      // update selectedTags info
                                      selectedTags[i] = clickedLi.data('varValue');
                                      // derive the new selectedVariation
                                      selectedVariation = deriveSelectedVariation( variations, selectedTags );

                                      // enable all menuItems in this menu
                                      menuItems
                                          .removeClass( cfg.disabledClass )
                                          .data('varDisabled', false);
                                      // and mark the clickedLi as current/selected
                                      highlightSelectedItem( menuElm, cfg );

                                    }

                                    menuElm
                                        .addClass( cfg.lastMenuClass );
                                    // refresh the enabled/disabled state on all
                                    // menuItems in the other menus
                                    $(menus)
                                        .each(function (j) {
                                            if ( j !== i )
                                            {
                                              var otherMenu = $(this);
                                              var available = deriveAvailableValues( j, i, variations, selectedTags, selectedVariation );
                                              otherMenu.removeClass( cfg.lastMenuClass );
                                              otherMenu.data('varMenuItems')
                                                  .each(function () {
                                                      var otherMenuItem = $(this);
                                                      var radioElm = otherMenuItem.find('input')[0];
                                                      var isUnavailable = !available[ otherMenuItem.data('varValue') ];
                                                      otherMenuItem
                                                          .data( 'varDisabled', isUnavailable )
                                                          .toggleClass( cfg.disabledClass, isUnavailable );
                                                      radioElm.title = this.orgTitle + (isUnavailable?' '+txt.unavail:'');
                                                      if ( isUnavailable   &&   otherMenuItem[0] === otherMenu.data('varSelectedItem') )
                                                      {
                                                        otherMenu.data('varSelectedItem', null);
                                                        otherMenuItem.removeClass( cfg.currentClass );
                                                        radioElm.checked = false;
                                                      }
                                                    });
                                            }
                                          });
                                  }
                                  if ( priceElm )
                                  {
                                    var newPrice = selectedVariation && selectedVariation.price || defaultPrice;
                                    var currentPrice = priceElm[0].firstChild;
                                    if ( newPrice !== currentPrice ) {
                                      $( currentPrice ).replaceWith( newPrice );
                                    }
                                  }
                                  if ( isChanged || isFirstRun )
                                  {
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
              .filter( '.'+cfg.currentClass )
                  .triggerHandler('click.variationmenu', [true]);

          // Release memory (GC)
          tagnames =
          taglabels =
          numTags =
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