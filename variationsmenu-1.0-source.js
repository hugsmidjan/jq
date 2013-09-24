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

  // returns the first variation that matches all the selectedTags
  var deriveSelectedVariation = function ( allVariations, selectedTags ) {
          var selectedVariation,
              l = allVariations.length,
              i = -1;
          varsLoop:while (++i<l)
          {
            var variation = allVariations[i],
                n = variation.length,
                k = -1;
            while (++k<n)
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
        },

      // returns an object with all tagValues (of index tagIdx), that are available alternatives based on all the other selectedTags values.
      deriveAvailableValues = function ( tagIdx,  allVariations, selectedTags ) {
          var availableVals = {},
              l = allVariations.length,
              i = -1;
          varsLoop:while (++i<l)
          {
            var variation = allVariations[i],
                n = variation.length,
                k = -1;
            while (++k<n)
            {
              if ( selectedTags[k]!== undefined  &&  k!==tagIdx  &&  variation[k] !== selectedTags[k] )
              {
                continue varsLoop;
              }
            }
            availableVals[ variation[tagIdx] ] = true;
          }
          return availableVals;
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
                i18n:           {
                    is:{ unavail:' (Samsetning ekki til)' },
                    en:{ unavail:' (Combination unavailable)' }
                  },
                disabledClass:  'disabled'
              }, cfg);

      var wrappers = [];

      this.each(function () {
          var cont = $(this),
              select = cont.find('select'),
              headline = cont.find('label').contents(),
              rnd = (new Date()).getTime(),

              txt = cfg.i18n[cont.closest('[lang]').attr('lang')] || cfg.i18n.en,

              // hidden input that carries the value of the selectbox
              hiddenInput = $('<input type="hidden" />').attr({ name:select[0].name }),

              imgCont = ( cfg.imgCont  &&  $.fn.variationsImages ) ?
                            $( cfg.imgCont ).variationsImages( cfg.variationsImages ):
                            null,

              tagnames = (select.attr('data-tagnames')||'').split('|'),
              taglabels = (select.attr('data-taglabels')||'').split('|') ,
              numTags = tagnames.length,
              tagTextSplitter = new RegExp('\\s*'+(select.attr('data-tagjoint')||cfg.tagJoint) +'\\s*' ),

              // list of available variationObjects
              variations = [/*  [ 'id':variationId, 0:tag1value, 1:tag2value, ... ],  [... */],
              // the currently selected variationObject
              selectedVariation, // the actual variations object (tag value list) that is currently selected. May be null.
              selectedTags = [/* tag1value, tag2value, ... */],  // list of currently selected tags - may be empty or incomplete.
              // map of tag types, their legend text and a list of unique values. (used to build the menus)
              tags =  $.map(tagnames, function (name, i) {
                          return { name:tagnames[i],  legend:taglabels[i],  vals:{/*  value1Name:value1Label, ... */}, tagData:{/*  value1Name:value1tagData, ... */} };
                        });


          // Hvarvest data from inside the select box and store it in `variations` and `tags`
          // (BUT before we harvest - remove empty options so single-option elements get autoselected)
          select.children().filter(function(){ return !$(this).attr('value'); }).remove();
          select.children(/*'option'*/).each(function(){
              var optElm = $(this),
                  variationId = optElm.attr('value');
              if ( variationId )
              {
                var text = optElm.text().split(tagTextSplitter),
                    vals = optElm.attr('data-tags').split('|'),
                    tagData = optElm.attr('data-tagdata'),
                    selected = optElm.is(':selected'),
                    varObj = [];
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

          // build the menus from the information stored in `tags`
          var menus = $.map(tags, function (t, i) {
                  var menuElm = $( cfg.menuTmpl.replace(/\{legend\}/g, t.legend) )
                                    .addClass( t.name ),
                      count = 0,
                      selectedItem,
                      items = $.map(t.vals, function (label, value) {
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
                                    selectedItem = item[0];
                                  }
                                  if ( cfg.itemBuilder )
                                  {
                                    item = cfg.itemBuilder(item, t.name, t.tagData[value], value, label)  ||  item;
                                  }
                                  item[0].orgTitle = label;
                                  return item[0];
                                });

                  if ( selectedItem  ||  items.length === 1 )
                  {
                    $(selectedItem || items[0])
                        .addClass( cfg.currentClass )
                        .find('input')
                            .prop('checked', true);
                  }

                  items = $(items)
                              .on('click.variationmenu', function (e, firstRun) {
                                  var thisElm = this,
                                      thisItem = $(thisElm),
                                      thisRadio = thisItem.find('input');
                                  // do nothing unless this is either firstRun
                                  // or if the clicked item is neither disabled nor already current
                                  if ( firstRun  ||  selectedItem !== thisElm)
                                  {
                                    if ( !firstRun || thisItem.is('.'+cfg.currentClass) )
                                    {
                                      // only mark the item as .current and update the enabled/disabled states
                                      // on real clicks (!firstRun) or if the targetItem is preselected on page load (current)
                                      if ( $(e.target).closest('[href]', thisElm)[0] )
                                      {
                                        // only preventDefault on link clicks. radio-input clicks shouldn't be touched
                                        e.preventDefault();
                                      }
                                      // unmark current state of selectedItem
                                      $(selectedItem)
                                          .removeClass( cfg.currentClass );
                                      // update selectedItem
                                      selectedItem = thisElm;
                                      if ( thisItem.data('varDisabled') )
                                      {
                                        // if the user clicked a disabled option - then we reset the whole selection.
                                        selectedTags = [];
                                      }
                                      // update selectedTags info
                                      selectedTags[i] = thisItem.data('varValue');
                                      // derive the new selectedVariation
                                      selectedVariation = deriveSelectedVariation( variations, selectedTags );
                                      // update the status (and enabled/disabled state) of thisItem
                                      thisItem
                                          .removeClass( cfg.disabledClass )
                                          .data('varDisabled', false)
                                          .addClass( cfg.currentClass );
                                      thisRadio
                                          .prop('checked', true)
                                          .attr('title', thisElm.orgTitle);

                                      // refresh the enabled/disabled state on all menu items across all menus
                                      $(menus)
                                          .each(function (j) {
                                              if ( j !== i )
                                              {
                                                var available = deriveAvailableValues( j,  variations, selectedTags );
                                                $(this).data('varMenuItems')
                                                    .each(function () {
                                                        var item = $(this),
                                                            radio = item.find('input'),
                                                            isUnavailable = !available[ item.data('varValue') ];
                                                        item
                                                            .toggleClass( cfg.disabledClass, isUnavailable )
                                                            .data( 'varDisabled', isUnavailable );
                                                        radio
                                                            .attr('title', this.orgTitle+(isUnavailable?txt.unavail:'') );
                                                        if ( isUnavailable  &&  radio.prop('checked') )
                                                        {
                                                          radio
                                                              .prop('checked', false);
                                                          item
                                                              .removeClass( cfg.currentClass );
                                                        }
                                                      });
                                              }
                                            });
                                    }
                                    thisItem.trigger( 'variationchanged', [selectedVariation, t.name, selectedTags[i]] );
                                    hiddenInput.val( selectedVariation ? selectedVariation.id : '' );
                                    imgCont  &&  imgCont.trigger('variationchanged', [selectedVariation && selectedVariation.id]);
                                  }
                                });
                  menuElm
                      .data( 'varMenuItems', items )
                      .find('[items]')
                          .replaceWith( items );
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
              .replaceAll( cont )
              .after( hiddenInput );

          $( menus[0] ).data('varMenuItems')
              .filter( ':first, .'+cfg.currentClass )
                  .last() // ensure we click the .current item if available
                      .triggerHandler('click.variationmenu', [true]);

          // Release memory (GC)
          tagnames = taglabels = numTags = tagTextSplitter = tags = cont = select = headline = rnd = wrapper = undefined;
        });

      return this.pushStack( wrappers );
    };

})(jQuery);