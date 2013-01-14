// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.scrollTable v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// Requires:
//  * jQuery 1.4
//  * $.fn.aquireId() (eutils 1.1)
//
// TODO:
//   * `destroy` method to un-wrap the table and return it to it's original state.
//
// Limitiations:
//   * 'focus' and 'blur' events don't bubble reliably, and thus can't be proxied properly.
//
(function($, undefined){


  var scrollTable = 'scrollTable',

      setColWidths = function ( elmData ) {
          var table = elmData.table,
              scrollbarWidth = elmData._init  &&  (elmData.tbWrap.width() - table.outerWidth()),
              tbCells = table.find('>tbody>tr:first>*') // select the children every time to allow for dynamic changes to the table
                            .css('width', ''),
              headandfoot = table.find('>thead,>tfoot').show(),
              iWidths = [],
              oWidths = [];
          tbCells
              .each(function (i) {
                  var cell = $(this);
                  oWidths[i] = cell.outerWidth();
                  iWidths[i] = cell.width();
                })
              .each(function (i) {
                  var padWidth = oWidths[i] - iWidths[i];
                  $(this).width( oWidths[i] - padWidth );
                });
          headandfoot.css( 'display', '' );
          elmData.clones.find('>*>tr') // select the children every time to allow for dynamic changes to the table
              .each(function () {
                  var col = 0,
                      cells = $(this).children();
                  cells
                      .each(function () {
                          var cell = $(this),
                              padWidth = cell.data('padWidth'),
                              span = (parseInt( cell.attr('colspan'), 10 ) || 1),
                              newOuterWidth = 0;
                          if ( padWidth === undefined )
                          {
                            padWidth = cell.outerWidth() - cell.width();
                            cell.data( 'padWidth', padWidth );
                          }
                          while ( span-- )
                          {
                            newOuterWidth += oWidths[ col++ ];
                          }
                          cell.width( newOuterWidth - padWidth );
                        });

                  if ( elmData._init )
                  {
                    cells.last()
                        .css( 'padding-right', function (i, pRight) {
                            return parseInt( pRight, 10 ) + scrollbarWidth;
                          });
                  }
               });
          elmData._init = undefined;
        },

      makeClones = function ( elmData ) {
          var table = elmData.table;
          elmData.clones &&  elmData.clones.remove();
          elmData.clones =  table.children( 'thead, tfoot' )
                                .map(function () {
                                    var original = $(this),
                                        tagName = this.tagName.toLowerCase(),
                                        clonedSection = original.clone()
                                                            .data( scrollTable+'-org', original ),
                                        tableClone = $( table[0].cloneNode(false) );
                                    elmData._proxyEvents  &&  clonedSection.bind( elmData._proxyEvents, elmData, proxyEvents);
                                    tableClone
                                        .attr( 'summary', 'Skip this table - it\'s for layout purposes only' )
                                        .append( original.is('thead') ? original.prevAll('caption').clone() : undefined )
                                        .append( clonedSection )
                                        .addClass( tagName+' '+(elmData._cloneClass) )
                                        ['insert'+ (tagName==='thead' ? 'Before' : 'After') ]( elmData.tbWrap );
                                    var allElms = tableClone.find('*').andSelf();
                                    // reimplementation of the $.fn.uniquifyIds plugin
                                    // remove onclick attributes to pervent double triggers...
                                    allElms.filter('[id]')
                                        .each(function () {
                                            var orgId = this.id,
                                                newId = $.aquireId( orgId ),
                                                elm = $(this).attr( 'id', newId );
                                            $.each(
                                                {
                                                  'input, select, textarea': 'label[for',
                                                  'area':                    'img[usemap'
                                                },
                                                function ( elmType, selector ) {
                                                    if ( elm.is(elmType) )
                                                    {
                                                      tableClone.find(selector+'="'+ orgId +'"]')
                                                          .attr( selector.split('[')[1], newId );
                                                    }

                                                  }
                                              );
                                          });


                                    if ( elmData._hasEvAttrs )
                                    {
                                      // remove oneventtype attributes to pervent double triggers...
                                      $.each(elmData._proxyEvents.split(/\s+/), function (i, eventtype) {
                                          allElms.removeAttr( 'on'+eventtype );
                                        });
                                    }

                                    return tableClone[0];
                                  });
        },


      // Feeble (primitive) attempt at proxying events from clone table to the corresponding element inside the original table.
      proxyEvents = function (e) {
          var cloneElm = this,
              elmData = e.data,
              original = $(cloneElm).data( scrollTable+'-org' ),
              linage = [],
              elm = e.target;
          while ( elm !== cloneElm )
          {
            linage.unshift( elm.tagName.toLowerCase() + ':nth-child('+ ($(elm).index()+1) +')' );
            elm = elm.parentNode;
          }
          var selector = '>'+linage.join('>'),
              ev = $.Event( e.type );
          $.each(elmData._proxyEvProps, function () {
              ev[this] = e[this];
            });
          original.find( selector ).trigger( ev );
          e.stopPropagation();
          ev.isDefaultPrevented()  &&  e.preventDefault();
        },


      scrollTables = [],

      refreshColWidths = function (/*e*/) {
          var i = scrollTables.length;
          while (i--)
          {
            var table = scrollTables[i],
                elmData = table.data( scrollTable );
            if ( !elmData )
            {
              // table has been either .removed() or is in some other way not scrollTable anymore.
              // Anyways, let's remove it from future loops.
              scrollTables = scrollTables.splice( i, 1 );
            }
            else if ( table.closest( 'html' )[0] ) // don't bother if table is .detach()ed from the dom.
            {
              setColWidths( elmData );
            }
          }
          if ( !scrollTables.length )
          {
            // stop resizing if no tables are left.
            $(window).unbind( 'resize', refreshColWidths );
          }
        };


  $.fn[scrollTable] = function (cfg, methodOpts) {
      // Capture method call
      if ( cfg === 'refresh' )
      {
        methodOpts = methodOpts || {};
        this.each(function () {
            var elmData = $(this).data( scrollTable );
            if ( methodOpts.reclone )
            {
              makeClones( elmData );
              elmData._init = 1;
            }
            elmData  &&  setColWidths( elmData );
          });
      }
      else // default to initialization
      {
        cfg = $.extend({}, $.fn[scrollTable].defaults, cfg);
        this
            // skip elements that may have previously been initialized
            .filter(function () {
                return !$(this).data( scrollTable );
              })
                .each(function () {
                    var table = $( this ),
                        elmData = {
                            table:         table,
                            tbWrap:        $( table.wrap( cfg.tbWrap||'<div class="tbody"/>' ).parent() ),
                            _cloneClass:   cfg.cloneClass,
                            _proxyEvents:  cfg.proxyEvents,
                            _proxyEvProps: cfg.proxyEvProps.split(/\s*,\s*/),
                            _hasEvAttrs:   cfg.hasEvAttrs,
                            _init:         1
                          };
                    if ( cfg.wrap )
                    {
                      elmData.wrap = $( cfg.wrap )
                                        .data( scrollTable, elmData );
                      elmData.tbWrap.wrap( elmData.wrap );
                    }
                    makeClones( elmData );
                    table
                        .css( 'margin', 0 )
                        .data( scrollTable, elmData );
                    setColWidths( elmData );
                    scrollTables.push( table );
                    $( window ).bind( 'resize', refreshColWidths);
                  });
      }
        return this;
    };

  $.fn[scrollTable].defaults = {
      //hasEvAttrs:   false,                        // are event attributes (i.e. `onclick=""`, etc.) likely to be found in the caption/thead/tfoot HTML?  If so, we need to remove them from the cloned elements!
      proxyEvents: 'click focusin focusout mouseup mousedown',  // Event types that are automatically proxied from the cloned to the actual (but hidden) table sections
      proxyEvProps: 'pageX pageY which',          // Event object properties that get proxied
      wrap:        '<div class="scrollable" />',  // Wrapper element around the table and it's clones. may be disabled
      //tbWrap:      '<div class="tbody"/>',        // The element that has the scrollbar. Required
      cloneClass:  'screen-only'                  // extra className that gets added to the cloned tables.
    };

})(jQuery);