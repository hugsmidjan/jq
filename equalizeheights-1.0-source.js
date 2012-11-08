// ----------------------------------------------------------------------------------
// jQuery.fn.equalizeHeights v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009-2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

(function($, idDataKey, undefined){

  var _quirkyOldIE = !!($.browser.msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode === 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      nextSetId = 0,
      _numSets = 0,
      _sets = {},
      _cfgs = {},
      _resetLock,    // ...to keep MSIE from spinning out of control
      _resetTimerRef, // ...to keep MSIE from spinning out of control
      _reRun = function (/*e*/) { // ...delayed run of _resetHeights() (to cut MSIE some slack for quickfire events like .onresize)
          if (!_resetLock)
          {
            clearTimeout( _resetTimerRef );
            _resetTimerRef = setTimeout(_resetHeights, 100);
          }
        },
      _resetHeights = function (/*e*/) { // Instantly reset the heights
          _resetLock = 1;
          for (var id in _sets)
          {
            _equalizeHeights(_sets[id], _cfgs[id].margins);
          }
          setTimeout(function(){ _resetLock = 0; }, 0);
        },

      _equalizeHeights = function (_collection, _margins) {
          var visibleElms = $(_collection).filter(':visible');
          if (visibleElms.length) // only equalize if at least one of the elements is :visible
          {
            var _maxHeight = 0,
                _paddings = [];

            visibleElms
                // find highest 'natural' element-height
                .each(function ( i ) {
                    var _this = $( this );
                    _this.css( _heightAttribute, '' );
                    var _totalHeight = _this.outerHeight(!!_margins);
                    _paddings[i] = _totalHeight - _this.height();
                    _maxHeight = Math.max( _totalHeight, _maxHeight );
                  })
                // assign new min-heights to visible elements of _collection
                .each(function( i ){
                    $(this).css( _heightAttribute,  _maxHeight - _paddings[i] + 0.5 ); // Adding 1px seems to fix some sub-pixel float-clearing calculation bugs in Firefox 3+
                  })
                .triggerHandler('equalizeheights', _maxHeight); // does not bubble!

            // kick the renderer
            document.body.className += '';
          }
        };

  $.fn.equalizeHeights = function ( cfg ) {
      var set = this,
          setId;
      if ( cfg === 'destroy' )
      {
        set.each(function (i) {
            var elm = $(this);
            setId = elm.data(idDataKey);
            var elmSet = _sets[ setId ];
            if ( elmSet )
            {
              var elmIdx = $.inArray(this, elmSet);
              if ( elmIdx > -1 )
              {
                elm
                    .removeData(idDataKey)
                    .css( _heightAttribute, '');
                elmSet.splice( elmIdx, 1 );
                if ( elmSet.length === 1  &&  $.inArray( elmSet[0], set.slice(i) )<0 )
                {
                  // destroy single-item sets whose leftover element is not contained
                  // in the rest of the 'destroy' set `set`,
                  // and are thus doomed to be left dangling.
                  $(elmSet).equalizeHeights( 'destroy' );
                }
                else if ( !elmSet.length )
                {
                  //  remove any trace of empty sets
                  delete _sets[setId];
                  delete _cfgs[setId];
                  _numSets--;
                }
                if ( !_numSets )
                {
                  // when no sets are left unbind the window resize and fontsize event handlers.
                  $( window ).unbind('.eqh');
                }
              }
            }
          });
      }
      else if (set.length>1)
      {
        setId = set.data(idDataKey);
        cfg = cfg === 'refresh' ?
                  _cfgs[ setId ]:
              cfg && cfg.$$done ?
                  cfg:
                  $.extend({
                        //margins: false,
                        //onceOnly: false,
                        $$done: 1
                      },
                      (typeof cfg === 'boolean') ? { margins:cfg } : cfg || {}
                    );

        if ( cfg )
        {
          if ( !_numSets )
          {
            $( window )
                .bind( 'resize.eqh', _reRun )
                .bind( 'load.eqh fontresize.eqh', _resetHeights );
          }
          if (!cfg.onceOnly  &&  setId == undefined )  // only set reize and fontresize events when cfg.onceOnly is false (default)
          {
            set.data(idDataKey, nextSetId); // prevent inifinite loops when looping through the _sets
            _sets[nextSetId] = set.toArray();
            _cfgs[nextSetId] = cfg;
            _numSets++;
            nextSetId++;
          }
          _equalizeHeights(set, cfg.margins);
        }
      }

      return set;
    };

  $.equalizeHeights = _reRun;

})(jQuery, 'eqh_setId');

