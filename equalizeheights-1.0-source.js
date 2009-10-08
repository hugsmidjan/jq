// TODO:
//  - Maybe?: create a "destroy" method that purges the jQuery collection/elements and _config from the cache and unbinds the 'resize' event handler.
//  - remove reliance on $.browser and use $.support instead
//  - remove detroyed/ sets and configs from the cache.

(function($, undefined){

  var _quirkyOldIE = !!($.browser.msie  && ( parseInt($.browser.version, 10) < 7 || document.compatMode == 'BackCompat' ) ),
      _heightAttribute = (_quirkyOldIE) ? 'height' : 'min-height',
      _evSet,
      setsIdx = 0,
      _sets = [],
      _cfgs = [],
      _resetLock,    // ...to keep MSIE from spinning out of control 
      _resetTimerRef, // ...to keep MSIE from spinning out of control
      _reRun = $.equalizeHeights = function (e) { // ...delayed run of _resetHeights() (to cut MSIE some slack for quickfire events like .onresize)
          if (!_resetLock)
          {
            clearTimeout( _resetTimerRef );
            _resetTimerRef = setTimeout(_resetHeights, 100);
          }
        },
      _resetHeights = function (e) { // Instantly reset the heights
          _resetLock = 1;
          var i = _sets.length;
          while (i--) { _equalizeHeights(_sets[i], _cfgs[i].margins); }
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
                    _this.css( _heightAttribute, 0 );
                    var _totalHeight = _this.outerHeight(!!_margins);
                    _paddings[i] = _totalHeight - _this.height();
                    _maxHeight = Math.max( _totalHeight, _maxHeight );
                  })
                // assign new min-heights to collection
                .each(function( i ){
                    $(this).css( _heightAttribute,  _maxHeight - _paddings[i] + .5 ); // Adding .5px seems to fix some sub-pixel float-clearing calculation bugs in Firefox 3+
                  })
                .triggerHandler('equalizeheights', _maxHeight); // does not bubble!

            // kick the renderer
            document.body.className += '';
          }
        };


  $.fn.equalizeHeights = function ( cfg ) {
    if (this.length>1)
    {
      cfg = (cfg == 'refresh') ? 
                _cfgs[this.eqh_setsIdx]:
            (cfg && cfg.$$done) ? 
                cfg:
                $.extend({
                      //margins: false,
                      //onceOnly: false,
                      $$done: 1
                    },
                    (typeof cfg == 'boolean') ? { margins:cfg } : cfg || {}
                  );

      if (cfg)
      {
        if (!cfg.onceOnly)  // only set reize and fontresize events when cfg.onceOnly is false (default)
        {
          if (this.eqh_setsIdx === undefined)
          {
            this.eqh_setsIdx = setsIdx++; // prevent inifinite loops when looping through the _sets
            _sets.push( this );
            _cfgs.push( cfg );
          }

          if (!_evSet)
          {
            _evSet = 1;
            $( window )
                .bind( 'resize', _reRun )
                .bind( 'load fontresize', _resetHeights );
          }
        }

        _equalizeHeights(this, cfg.margins);
      }
    }

    return this;
  };


})(jQuery);

