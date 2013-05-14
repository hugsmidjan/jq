// ----------------------------------------------------------------------------------
// jQuery.fn.switchlist v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

(function($) {

  var _defaultConfig = {
          items:         'div.item',
          contClass:     'switchlist-active',
          activeClass:   'active',
          listClass:     'newsheadlinelist itemlist',
        /* BEGIN: sleppa þessu og/eða gera þetta meira módúlar */
          inclmeta:      "before", /* falsy values hide the span.meta  Allowed values are "before" and "after" */
          incltitle:     true,
          //inclimg:       false,
          //topwrap:       false,
          //bottomwrap:    false,
        /* END: sleppa þessu og/eða gera þetta meira módúlar */
          switchdelay:   350,
          fadeoutspeed:  125,
          fadeoutease:   '',
          fadeinspeed:   400,
          fadeinease:    ''
        };


  $.fn.switchlist = function ( options ) {

      if ( options ) {
        _config = $.extend({}, _defaultConfig, options );
      }

      this.addClass( _config.contClass );

      var _newsitems = this.find( _config.items ),
          _visibleIndex = 0,
          _switchHlTimeout,
          _headlinelist = $('<ul class="'+_config.listClass+'" />'),
          _headlines;

      _newsitems
          .slice(1)
              .hide()
          .end()
          .each(function(i){
              var _this = $(this),
                  _newsheadline = $('<li>')
                      .addClass( this.className.replace(/(^| )((item|itm\d*|firstitem)( |$))+/g, '$1') )
                      .addClass( i===0 ? _config.activeClass:'' )
                    /* BEGIN: þetta ætti að vera stillanlegra/meira módúlar */
                      .append( _config.topwrap ? '<i class="top" />' : '' )
                      .append( _config.inclimg ? _this.find('img').clone() : '' )
                      .append(( _config.inclmeta && _config.inclmeta !== 'after') ? _this.find('span.meta').clone() : '' )
                      .append( _config.incltitle ? _this.find('h3 > a').clone() : '' )
                      .append(( _config.inclmeta == 'after') ? _this.find('span.meta').clone() : '' )
                      .append( _config.bottomwrap ? '<i class="bottom" />' : '' )
                    /* END: þetta ætti að vera stillanlegra/meira módúlar */
                      .bind('mouseenter', function (e) {
                          var _thisHeadline = this;
                          if (!_headlinelist.queue().length && _visibleIndex != _thisHeadline.listIndex)
                          {
                            _switchHlTimeout = setTimeout(function () {
                                var _visibleIndexAtStart = _visibleIndex;
                                _visibleIndex = _thisHeadline.listIndex;
                                _headlinelist
                                    .queue(function(){
                                        _newsitems
                                            .eq( _visibleIndexAtStart )
                                                .fadeOut( _config.fadeoutspeed, _config.fadeoutease )
                                                .queue(function(){
                                                    _headlinelist.dequeue();
                                                    $(this).dequeue();
                                                  });
                                      })
                                    .queue(function(){
                                        _headlines
                                            .eq( _visibleIndexAtStart )
                                                .removeClass( _config.activeClass );
                                        $(_thisHeadline)
                                            .addClass( _config.activeClass );
                                        _headlinelist.dequeue();
                                        _newsitems
                                            .eq( _thisHeadline.listIndex )
                                                .fadeIn(
                                                    _config.fadeinspeed,
                                                    _config.fadeinease,
                                                    function() {
                                                        if ( 8>parseInt((/(msie) ([\w.]+)/.exec(navigator.userAgent)||[])[1],10) )
                                                        {
                                                          this.style.removeAttribute('filter');
                                                        }
                                                      }
                                                  );
                                      });

                              }, _config.switchdelay);
                          }
                        })
                      .bind('mouseleave', function (e) {
                          clearTimeout( _switchHlTimeout );
                          _switchHlTimeout = null;
                        })
                      .appendTo( _headlinelist );
              _newsheadline[0].listIndex = i;
            });

      _headlinelist.prependTo(this);
      _headlines = _headlinelist.find('li');

    return this;
  };


})(jQuery);