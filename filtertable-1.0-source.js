// ----------------------------------------------------------------------------------
// jQuery.fn.filterTable v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// TODO:
//  * trigger a cancellable beforefilter event
//  * expose "before" value array on filter events
//  * support a public "filter" method that accepts value array or (input index + single value)
//  * expose element.data() object with arrays of inputs and clear buttons.
//  * noFound message + <tr> template
//  * minChars support

(function($, undefined){

    var msie7 = 8>parseInt((/MSIE ([\w.]+)/.exec(navigator.userAgent)||[])[1],10);

/*
  $.fn.normalizeTable = function (cfg) {
      if (this.length)
      {
        cfg = $.extend({
                  //allowEmptyTHead: false
                }, cfg);

        this.filter('table').each(function(){
            var table = $(this);
*/
  var _normalizeTable = function (table, cfg) {
            var table = $(table).filter('table').eq(0);
/* -- */
            if ( !cfg.thead  &&  !table.find('thead').length )
            {
              var tbody = table.find('tbody'),
                  thead = $('<thead />').insertBefore( tbody[0] ),
                  allRows = tbody.find('tr'),
                  x/* dummy */;

              allRows.each(function(i){
                  var tr = $(this),
                      trTDs = tr.find('td');
                  if ( (tr.find('th').length  &&  (!trTDs.length  ||  i === 0) )  ||  _cellsHaveOnlyBoldText(trTDs) )
                  {
                    tr.appendTo(thead);
                    return; // continue
                  }
                  return false; // exit each-loop early
                });
/*
              if (!cfg.allowEmptyTHead && !thead.find('tr').length)
              {
                thead.remove();
              }
          });
      }
      return this;
    },
*/
            }
        };
/* -- */

  var _F = function(){},
      _beget = $.beget || function (proto, props) {
          _F.prototype = proto;
          return props ? $.extend(new _F, props) : new _F;
        },


      _cellsHaveOnlyBoldText = function (cells) {
          return !$(cells).clone().find('>b, >strong').remove().end().text().replace(/\s/g, '');
        },

      _getCellSpan = function(cell){
          cell = $(cell);
          return {
              cols: parseInt('0'+cell.attr('colspan'), 10) || 1,
              rows: parseInt('0'+cell.attr('rowspan'), 10) || 1
            };
        },



      _clearFilterInput = function (e) {
          $(this)
              .data(_data_keyName).input
                  .val('')
                  .trigger('change')
                  .trigger('focus');
          e.stopPropagation();
        },

      _selectAll = function (e) {
          this.select();
        },
      _setFocusClass = function (e) {
          var input = $(this);
          input.closest('td, th').toggleClass( input.data(_data_keyName).cfg.fieldFocusClass, e.type=='focus' );
        },


      _toggleRows = function(rows, cfg, makeVisible){
          $(rows).each(function(){
              var row = $(this);
              if (cfg.hideRowClass)
              {
                row.toggleClass(cfg.hideRowClass, makeVisible);
              }
              else if (makeVisible)
              {
                row.css('display', '');
              }
              else
              {
                row.hide();
              }
            });
        },
      _showRows = function(rows, cfg){ _toggleRows(rows, cfg, 1); },
      _hideRows = function(rows, cfg){ _toggleRows(rows, cfg, 0); },


      _monitorFilterInput = function (e) {
          var input = $(this),
              data = input.data(_data_keyName);

          clearTimeout(data._searchThread);
          if (e.type == 'change')
          {
            _dealWithFilterInput(input);
          }
          else
          {
            data._searchThread = setTimeout(function(){ _dealWithFilterInput(input); }, data.cfg.delay);
          }
        },


      _dealWithFilterInput = function (input) {
          var val = input.val(),
              data = input.data(_data_keyName),
              lastValue = data.lastValue,
              table = data.table,
              cfg =  data.cfg,
              clearBtn = data.btn,
              activeColClass = cfg.activeColClass,
              doToggleClass;

          delete data._searchThread;

          if (val && !lastValue) // only toggle things if the hasValue state has changed
          {
            doToggleClass = 1;
            if (!cfg.multiFilter) // if multiFilter is off, then clear all other inputs.
            {
              data.allInputs.not(input)
                  .each(function(i){
                      var inp = this,
                          inpData = $(inp).data(_data_keyName);
                      if (inp.value)
                      {
                        this.value = inpData.lastValue = '';
                        _toggleColClass(table, inpData.idx, activeColClass, 0);
                      }
                    });
            }
          }
          else if (!val && lastValue) // only toggle things if the hasValue state has changed
          {
            doToggleClass = 1;
          }
          data.lastValue = val;

          if (doToggleClass)
          {
            _toggleColClass(table, data.idx, activeColClass, !!val);
          }

          if (val != lastValue)
          {
            _performRowSearch(data)
          }

          table.useCellMapCache = 0; // invalidate the CellMapCache.
        },


      _performRowSearch = function (data) {
          _computeCellMap( data.table );
          var cfg = data.cfg,
              tbody = data.table.find('tbody'),
              candiateRows = tbody.find('tr'),
              someFilterActive;

          if (cfg.isStickyRow)
          {
            candiateRows = candiateRows.filter(function(){
                var rows = $(this).filter(cfg.isStickyRow);
                _showRows(rows, cfg); // show the sticky rows that we skip.
                return !rows.length;
              });
          }
          if (cfg.isHideRow)
          {
            candiateRows = candiateRows.filter(function(){
                var rows = $(this).filter(cfg.isHideRow);
                _hideRows(rows, cfg);
                return !rows.length;
              });
          }

          data.allInputs
              .each(function(i){
                  var input = $(this),
                      data = input.data(_data_keyName);
                  if (data.lastValue)
                  {
                    someFilterActive = 1;
                    var val = $.trim( this.value );
                    val = cfg.matchCase ? val : val.toLowerCase();

                    candiateRows
                        .each(function(){
                            var row = $(this),
                                cellMap = row.data(_cellMap_keyName),
                                cell = cellMap[i];
                            _toggleRows(row, cfg, (cell && cfg.cellMatches(cell, val, data)) );
                          });
                    candiateRows = candiateRows.filter(':visible')
                  }
                });

          if (!someFilterActive)
          {
            _showRows( tbody.find('tr'), cfg );
          }
          data.table
              .toggleClass(cfg.activeTableClass, someFilterActive)
              .trigger('filter.filterTable');
        },


      _computeCellMap = function (table) {
          if (!table.useCellMapCache)
          {
            var colHeadRowSpans = [];
            $(table).find('tr').each(function(){
                var row = $(this),
                    currCol = 0,
                    foundCell,
                    cellMap = [];
                row
                    .data(_cellMap_keyName, cellMap)
                    .children()
                        .each(function(){
                            while (colHeadRowSpans[currCol])
                            {
                              // previous column-cell spans across this row. decrement rowSpan counter and continue with loop
                              colHeadRowSpans[currCol++]--;
                            }
                            var cell = this,
                                span = _getCellSpan(cell),
                                colspan = span.cols;
                            cellMap[currCol] = cell;
                            while (colspan--)
                            {
                              colHeadRowSpans[currCol] = span.rows-1;
                              currCol++;
                            }
                          });
                cellMap.length = currCol;
              });
            table.useCellMapCache = 1;
          }
        },


      _toggleColClass = function (table, idx, className, addClass) {
          _computeCellMap( table );
          var rows = $(table).find('tr'),
            cells = rows.map(function(){
              return $(this).data(_cellMap_keyName)[idx] || null; // null removes the item from the resulting array
            });
          cells.toggleClass(className, addClass);
        },


      protoFilterRow,
      protoCell,
      protoInput,
      protoClearBtn,
      protoFilterCell,

      _data_keyName = 'filterTable',
      _cellMap_keyName = _data_keyName+'-cellMap',
      TRUE = !0; // true




  $.fn.filterTable = function (cfg) {
      ;;;var debugMode = !!arguments.callee.debugMode;
      if (this.length)
      {
        var tables = this.filter('table').add( this.find('table') );
        if (tables.length)
        {
          cfg = _beget(arguments.callee.defaults, cfg);

          // create clonable prototype elements
          var protoFilterRow  =  protoFilterRow   ||  $(cfg.filterRow),
              protoInput      =  protoInput       ||  $(cfg.inputField)
                                                          .bind('focus', _selectAll)
                                                          .bind('focus blur', _setFocusClass)
                                                          .bind('change keyup', _monitorFilterInput),
              protoClearBtn   =  protoClearBtn    ||  $(cfg.clearBtn).bind('click', _clearFilterInput),
              protoCell       =  protoCell        ||  $(cfg.filterCell),
              protoFilterCell =  protoFilterCell  ||  protoCell.clone(TRUE).empty().append(protoInput);

          tables
              .each(function(){
                  _normalizeTable( this, cfg );
                  var table = $(this),
                      bodyRows = table.find('tbody tr'),
                      thead = cfg.thead ? $(cfg.thead) : table.find('thead'),
                      headRows = thead.find('tr'),
                      filterRow = protoFilterRow.clone(TRUE),
                      filterInputs,
                      isTHeadEmpty = !headRows.length,

                      protoData = {
                          cfg:    cfg,
                          //allInputs: filterInputs, // <-- assigned below
                          table:  table
                        },

                      colHeaders = [],
                      colHeadRowSpans = [];

                  headRows = isTHeadEmpty ? bodyRows.eq(0) : headRows;
                  headRows.each(function(){
                      var colIdx = 0;
                      $('>*', this).each(function(__x__, tCell){
                          while (colHeadRowSpans[colIdx])
                          {
                            // previous column-cell spans across this row. decrement rowSpan counter and continue with loop
                            colHeadRowSpans[colIdx++]--;
                          }
                          // insert the current column-cell into the list of headers.
                          var span = _getCellSpan(tCell),
                              colspan = span.cols;
                          // because old MSIEs report incorrect rowspans for cells with rowSpan greater than the number of remaining rows.
                          msie7  &&  $(tCell).attr('rowspan', span.rows);
                          colHeaders[colIdx] = tCell; // always enforce first cell
                          while (colspan--)
                          {
                            colHeaders[colIdx] = colHeaders[colIdx] || tCell;
                            colHeadRowSpans[colIdx] = span.rows-1;
                            colIdx++;
                          }
                        });
                    });

                  colHeaders = $(colHeaders)
                      // trim the rowspan values of the column-headers, to allow filter-cells to align up properly
                      .each(function(i){
                          var refTH = $(this);
                          if (colHeadRowSpans[i])
                          {
                            refTH.attr('rowspan', headRows.length);
                          }
                          var newClearBtn = protoClearBtn.clone(TRUE),
                              inputData = _beget(protoData, {
                                  //lastValue: '',
                                  idx:  i,
                                  btn:  newClearBtn
                                }),
                              newCell = ( ( refTH.filter(cfg.includeCols/*||''*/).length  || isTHeadEmpty ) ?  protoFilterCell : protoCell ).clone(TRUE),
                              newInput = newCell
                                            .appendTo(filterRow)
                                            .find('input')
                                                .data(_data_keyName, inputData)
                                                .after(newClearBtn);
                          newClearBtn.data(_data_keyName, { input: newInput });
                        });

                  protoData.allInputs = filterRow.find('input');

                  filterRow.appendTo(thead);

                  if (cfg.fixColWidths)
                  {
                    var colW = [],
                        W = 0;
                    filterRow.find('>*')
                        .each(function(i){
                            var w = parseInt( $(this).width(), 10 );
                            colW[i] = w;
                            W += w;
                          })
                        .each(function(i){
                            $(this).width( (100*colW[i]/W)+'%' );
                          });
                  }

                  ;;; if (debugMode) {
                  ;;;   table.addClass('tablefilters-debug');
                  ;;;   colHeaders.addClass('debug-activeHeader').each(function(i){ $(this).append(' ('+(i+1)+')') })
                  ;;;   window.console&&console.log( [table[0]],'colHeaders: ', colHeaders );
                  ;;; }

                });
          }
      }
      return this;
    };

  $.fn.filterTable.defaults = {
      //thead:            null, // or Element
      fixColWidths:     true,
      filterRow:        '<tr class="filters" />',
      filterCell:       '<td>&nbsp;</td>',
      inputField:       '<input />',
      clearBtn:         '<span class="clearfilter"/>',
      activeTableClass: 'filters-active',
      fieldFocusClass:  'filter-focus',
      activeColClass:   'filter-col',
      //hideRowClass:     '',     // if falsy - .hide() and .css(display,'') are used.
      includeCols:      function () {  return $(this).is('th') || _cellsHaveOnlyBoldText(this);  }, // selector or filter function
      //isHideRow:        null,   //  '.notaresult' ...or...  function() { return $(this).is('.notaresult'); },  // hide these rows whenever a filter is active - regardless of their content.
      //isStickyRow:      null,   //  '.staticRow' ...or...  function() { return $(this).is('.staticRow'); },    // always display these rows - regardless of filter status/content.
      //multiFilter:      false,
      cellMatches: function (cell, val, data) {
          var text = $(cell).text() || '',
              cfg = data.cfg,
              pos;
          text = cfg.matchCase ? text : text.toLowerCase();
          pos = text.indexOf(val);
          return cfg.substrSearch ? pos > -1 : !pos;
        },
      //matchCase:        false,
      substrSearch:     true,
      //minChars:         2, //NOT IMPLEMENTED YET
      delay:            300
    };

})(jQuery);


