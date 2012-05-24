// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.variationsMenu v 1.0
// ----------------------------------------------------------------------------------
// (c) 2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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
              if ( variation[k] != selectedTags[k] )
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
              if ( selectedTags[k]!== undefined  &&  k!=tagIdx  &&  variation[k] != selectedTags[k] )
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
                imgItems:       '>*',         // sub-selector inside imgCont - to find the image items (default + for each variation)
                imgContOnClass: 'variated',
                imgOnClass:     'active',     // classname for imgItems that are active
                // turns simpler image links into proper thumbnail images right before `variationImageActive`
                imgOnBuilder:   function (imgLi) {
                    if ( !imgLi.is('.image') )
                    {
                      var link = imgLi.find('a');
                      imgLi.addClass('image');
                      link.addClass('img');
                      $('<img/>')
                          .attr({
                              src: link.attr('data-img'),
                              alt: link.text()
                            })
                          .appendTo( link.empty() );
                    }
                  },
                imgClickFirst: !!$.fn.bigimgSwitcher, // flags whether first :visible imgItem should be 'clicked' to trigger `newbigimg`
                tagJoint:       ' - ',
                wrapper:        '<fieldset class="variationsmenu"><i headline/><i menus/></fieldset>',
                wrapperHl:      '<h3/>',
                menuTmpl:       '<fieldset class="fi_rdo req"><h4>{legend}</h4><ul><li items/></ul></fieldset>',
                menuItem:       '<li class="{value}"><input type="radio" name="{tagname}" value="{value}" id="{id}" /><label for="{id}">{label}</label></li>',
                //itemBuilder:    function(itemElm, tagname, tagData, value, label) { /* play with the item, or (optionally) return a new one */ },
                emptyLabel:     '--',
                currentClass:   'current',
                disabledClass:  'disabled'
              }, cfg);

      var wrappers = [];

      this.each(function () {
          var cont = $(this),
              select = cont.find('select'),
              imgCont = $( cfg.imgCont ).addClass( cfg.imgContOnClass ),
              headline = cont.find('label').contents(),
              rnd = (new Date()).getTime(),

              // hidden input that carries the value of the selectbox
              hiddenInput = $('<input type="hidden" />').attr({ name:select[0].name }),

              tagnames = (select.attr('data-tagnames')||'').split('|'),
              taglabels = (select.attr('data-taglabels')||'').split('|') ,
              numTags = tagnames.length,
              tagTextSplitter = new RegExp('\\s*'+(select.attr('data-tagjoint')||cfg.tagJoint) +'\\s*' ),

              // list of available variationObjects
              variations = [/*  [ 'id':variationId, 0:tag1value, 1:tag2value, ... ],  [... */],
              // the currently selected variationObject
              selectedVariation,
              selectedTags = [/* tag1value, tag2value, ... */],
              // map of tag types, their legend text and a list of unique values. (used to build the menus)
              tags =  $.map(tagnames, function (name, i) {
                          return { name:tagnames[i],  legend:taglabels[i],  vals:{/*  value1Name:value1Label, ... */}, tagData:{/*  value1Name:value1tagData, ... */} };
                        });


          // Hvarvest data from inside the select box and store it in `variations` and `tags`
          select.children(/*'option'*/).each(function (i) {
              var optElm = $(this),
                  id = optElm.attr('value');
              if ( id )
              {
                var text = optElm.text().split(tagTextSplitter),
                    vals = optElm.attr('data-tags').split('|'),
                    tagData = optElm.attr('data-tagdata'),
                    selected = optElm.is(':selected'),
                    varObj = [];
                tagData = tagData ? tagData.split('|') : [];
                varObj.id = id;
                for (var n=0; n<numTags; n++)
                {
                  var val = vals[n] || ''; // ||'' is not strictly neccessary
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
                      lastItem,
                      items = $.map(t.vals, function (label, value) {
                                  var itemHTML =  cfg.menuItem
                                                      .replace(/\{id\}/g,     t.name+rnd+'-'+ (count++) )
                                                      .replace(/\{tagname\}/g, t.name+rnd)
                                                      .replace(/\{label\}/g,   label)
                                                      .replace(/\{value\}/g,   value),
                                      item =  $( itemHTML )
                                                  .data('varValue', value);
                                  if ( value == selectedTags[i] )
                                  {
                                    item
                                        .addClass( cfg.currentClass )
                                        .find('input')
                                            .prop('checked', true);
                                    lastItem = item[0];
                                  }
                                  if ( cfg.itemBuilder )
                                  {
                                    item = cfg.itemBuilder(item, t.name, t.tagData[value], value, label)  ||  item;
                                  }
                                  return item.toArray();
                                });

                  items = $(items)
                              .on('click.variationmenu', function (e, firstRun) {
                                  var thisItem = this,
                                      $thisItem = $(thisItem);
                                  // do nothing unless this is either firstRun
                                  // or if the clicked item is neither disabled nor already current
                                  if ( firstRun  ||  (lastItem != thisItem  &&  !$thisItem.data('varDisabled') ))
                                  {
                                    if ( !firstRun || $thisItem.is('.'+cfg.currentClass) )
                                    {
                                      // only mark the item as .current and update the enabled/disabled states
                                      // on real clicks (!firstRun) or if the targetItem is preselected on page load (current)
                                      if ( $(e.target).closest('[href]', thisItem)[0] )
                                      {
                                        // only preventDefault on link clicks. radio-input clicks shouldn't be touched
                                        e.preventDefault();
                                      }
                                      // unmark current state of lastItem
                                      $(lastItem)
                                          .removeClass( cfg.currentClass );
                                      // update lastItem
                                      lastItem = thisItem;
                                      // update selectedTags info
                                      selectedTags[i] = $thisItem
                                                            .addClass( cfg.currentClass ) // (and mark thisItem as current)
                                                            .find('input')
                                                                .prop('checked', true)
                                                            .end()
                                                            .data('varValue');
                                      // derive the new selectedVariation
                                      selectedVariation = deriveSelectedVariation( variations, selectedTags );
                                      // refresh the enabled/disabled state on all menu items across all menus
                                      $(menus)
                                          .data('selectedvariation', selectedVariation)
                                          .each(function (i) {
                                              var available = deriveAvailableValues( i,  variations, selectedTags );
                                              $(this).data('varMenuItems')
                                                  .each(function () {
                                                      var item = $(this),
                                                          isUnavailable = !available[ item.data('varValue') ];
                                                      item
                                                          .toggleClass( cfg.disabledClass, isUnavailable )
                                                          .data( 'varDisabled', isUnavailable )
                                                          .find('input:radio, button')
                                                              .prop('disabled', isUnavailable );
                                                    });
                                            });
                                    }
                                    imgCont
                                        .each(function () {
                                            var images = $(this).find( cfg.imgItems ),
                                                defaultImgs = [],
                                                activeImgs = images.filter(function () {
                                                    var imgItem = $(this),
                                                        variations = imgItem.attr('data-forvariation'),
                                                        selectedId = selectedVariation  &&  selectedVariation.id,
                                                        isActive =  variations ?
                                                                        $.inArray( selectedId,  variations.split('|') ) > -1:
                                                                        !selectedId;
                                                    !variations  &&  defaultImgs.push( imgItem[0] );
                                                    imgItem.toggleClass( cfg.imgOnClass, isActive );
                                                    // initiate virgin imgItems
                                                    if ( isActive  &&  !imgItem.data('variationinited') )
                                                    {
                                                      cfg.imgOnBuilder  &&  cfg.imgOnBuilder(imgItem);
                                                      imgItem
                                                          .trigger('variationImageActive')
                                                          .data('variationinited', true);
                                                    }
                                                    return isActive;
                                                  });
                                            if ( !activeImgs[0] )
                                            {
                                              $( defaultImgs ).addClass( cfg.imgOnClass );
                                            }
                                            if ( cfg.imgClickFirst  &&  (activeImgs[0] || !firstRun) )
                                            {
                                              $( activeImgs[0] || defaultImgs[0] ).trigger('click');
                                            }
                                          });

                                    !firstRun  &&  $thisItem.trigger( 'variationchanged', [selectedVariation, t.name, selectedTags[i]] );
                                    hiddenInput.val( selectedVariation ? selectedVariation.id : '' );
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