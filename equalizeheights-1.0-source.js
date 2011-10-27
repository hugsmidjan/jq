// encoding: utf-8
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

  var _quirkyOldIE = !!($.browser.msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      _evSet,
      setsIdx = 0,
      _sets = [],
      _cfgs = [],
      _resetLock,    // ...to keep MSIE from spinning out of control 
      _resetTimerRef, // ...to keep MSIE from spinning out of control
      _reRun = function (e) { // ...delayed run of _resetHeights() (to cut MSIE some slack for quickfire events like .onresize)
          if (!_resetLock)
          {
            clearTimeout( _resetTimerRef );
            _resetTimerRef = setTimeout(_resetHeights, 100);
          }
        },
      _resetHeights = function (e) { // Instantly reset the heights
          _resetLock = 1;
          var i = _sets.length;
          while (i--)
          {
            _equalizeHeights(_sets[i], _cfgs[i].margins);
          }
          setTimeout(function(){ _resetLock = 0; }, 0);
        },

      _equalizeHeights = function (_collection, _margins) {
          if (_collection.filter(':visible').length) // only equalize if at least one of the elements is :visible
          {
            var _maxHeight = 0,
                _paddings = [];

            _collection
                // find highest 'natural' element-height
                .each(function ( i ) {
                    var _this = $( this );
                    _this.css( _heightAttribute, '' );
                    var _totalHeight = _this.outerHeight(!!_margins);
                    _paddings[i] = _totalHeight - _this.height();
                    _maxHeight = Math.max( _totalHeight, _maxHeight );
                  })
                // assign new min-heights to collection
                .each(function( i ){
                    $(this).css( _heightAttribute,  _maxHeight - _paddings[i] + .5 ); // Adding 1px seems to fix some sub-pixel float-clearing calculation bugs in Firefox 3+
                  })
                .triggerHandler('equalizeheights', _maxHeight); // does not bubble!

            // kick the renderer
            document.body.className += '';
          }
        };


  $.fn.equalizeHeights = function ( cfg ) {
      var set = this;
      if ( cfg == 'destroy' )
      {
        set.each(function (i) {
            var elm = $(this),
                setIdx = elm.data('eqh_setsIdx'),
                theSet = _sets[ setIdx ];
            if ( theSet )
            {
              var elmIdx = theSet.index(this);
              if ( elmIdx > -1 )
              {
                elm
                    .removeData('eqh_setsIdx')
                    .css( _heightAttribute, '');
                [].splice.call(theSet, elmIdx, 1 );
                _sets[ setIdx ] = theSet;
                if ( theSet.length == 1  &&  set[i+1] != theSet[0] )
                {
                  theSet.equalizeHeights( 'destroy' );
                }
                else if ( !theSet.length )
                {
                  _sets = _sets.splice(setIdx,1);
                  _cfgs = _cfgs.splice(setIdx,1);
                }
                if ( !_sets.length )
                {
                  $( window ).unbind('.eqh');
                }
              }
            }
          });
      }
      else if (set.length>1)
      {
        {
          var eqh_setIdx = set.data('eqh_setsIdx');
          cfg = cfg == 'refresh' ?
                    _cfgs[ eqh_setIdx ]:
                cfg && cfg.$$done ? 
                    cfg:
                    $.extend({
                          //margins: false,
                          //onceOnly: false,
                          $$done: 1
                        },
                        (typeof cfg == 'boolean') ? { margins:cfg } : cfg || {}
                      );

          if ( cfg )
          {
            if (!cfg.onceOnly)  // only set reize and fontresize events when cfg.onceOnly is false (default)
            {
              if ( eqh_setIdx == undefined ) // ==undefined also matches "null"
              {
                set.data('eqh_setsIdx', setsIdx++); // prevent inifinite loops when looping through the _sets
                _sets.push( set );
                _cfgs.push( cfg );
              }

              if (!_evSet)
              {
                _evSet = 1;
                $( window )
                    .bind( 'resize.eqh', _reRun )
                    .bind( 'load fontresize.eqh', _resetHeights );
              }
            }

            _equalizeHeights(set, cfg.margins);
          }
        }
      }

      return set;
    };

  $.equalizeHeights = _reRun;

})(jQuery);

