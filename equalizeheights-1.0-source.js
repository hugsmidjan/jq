// ----------------------------------------------------------------------------------
// jQuery.fn.equalizeHeights v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

// TODO:
//  - remove reliance on $.browser and use $.support instead
//  - remove destroyed/ sets and configs from the cache.

(function($, undefined){

  var _quirkyOldIE = !!($.browser.msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode === 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      _evSet,
      setsIdx = 0,
      _sets = [],
      _cfgs = [],
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
          var i = _sets.length;
          while (i--)
          {
            _equalizeHeights(_sets[i], _cfgs[i].margins);
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
      var set = this;
      if ( cfg === 'destroy' )
      {
        set.each(function (i) {
            var elm = $(this),
                setIdx = elm.data('eqh_setsIdx'),
                theSet = _sets[ setIdx ];
            if ( theSet )
            {
              var elmIdx = $.inArray(this, theSet);
              if ( elmIdx > -1 )
              {
                elm
                    .removeData('eqh_setsIdx')
                    .css( _heightAttribute, '');
                theSet.splice( elmIdx, 1 );
                if ( theSet.length === 1  &&  0 > $.inArray( theSet[0], set.slice(i) ) )
                {
                  // destroy single-item sets whose leftover element is not contained
                  // in the rest of the 'destroy' set `set`,
                  // and are thus doomed to be left dangling.
                  $(theSet).equalizeHeights( 'destroy' );
                }
                else if ( !theSet.length )
                {
                  //  remove any trace of empty sets
                  _sets = _sets.splice(setIdx,1);
                  _cfgs = _cfgs.splice(setIdx,1);
                }
                if ( !_sets.length )
                {
                  // when no sets are left unbind the window resize and fontsize event handlers.
                  $( window ).unbind('.eqh');
                  _evSet = 0;
                }
              }
            }
          });
      }
      else if (set.length>1)
      {
        var eqh_setIdx = set.data('eqh_setsIdx');
        cfg = cfg === 'refresh' ?
                  _cfgs[ eqh_setIdx ]:
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
          if (!cfg.onceOnly  &&  eqh_setIdx == undefined )  // only set reize and fontresize events when cfg.onceOnly is false (default)
          {
            set.data('eqh_setsIdx', setsIdx); // prevent inifinite loops when looping through the _sets
            _sets[setsIdx] = set.toArray();
            _cfgs[setsIdx] = cfg;
            setsIdx++;
          }

          $( window )
              .bind( 'resize.eqh', _reRun )
              .bind( 'load.eqh fontresize.eqh', _resetHeights );

          _equalizeHeights(set, cfg.margins);
        }
      }

      return set;
    };

  $.equalizeHeights = _reRun;

})(jQuery);

