// ----------------------------------------------------------------------------------
// jQuery.fn.fickle v 2.0
// ----------------------------------------------------------------------------------
// (c) 2009-2012 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  Depends on eutils 1.2+:
      $.fn.focusHere()
      $.fn.unhide()
      $.beget()

  Usage:

    Turn any element into a ficle/volatile popup with open/close method (+ events) that will automatically close on focusout.

      $('<div class="mypopup">Content</div>').fickle( options );

    defaultOptions: {
      fickle:      true,      // by default the element is "fickle" and auto-closes as soon as the user clicks elsewhere,
                             // or moves the keyboard-focus out of the element. Set this to false to disable any "auto-closing" behaviour...
                             // A Non-fickle element has only advanced open/close/toggle methods, but no super-special "fickle" properties.
      focusElm:    null,     // Selector/Element which should receive keyboard focus (and scroll into view) on fickleopen. (Defaults to the fickle element itself)
      closeOnEsc:  true,     // set to false to disable keyboard "Esc" keypress to run  .fickle(`close`)
      trapFocus:   false,    // attempts to retain (and return) the keyboard focus within the fickle element.
      closeDelay:  300,      // Specifies a "grace period" before a `focusout` causes a .fickle(`close`).
      startOpen:   false,    // Instantly shows and `open`s the fickle element.  No fadeIns or any fancy effects.
      silent:      false,    // when true, focus is not transferred on open/close.
      bubble:      false,    // when true, custom open/close events bubble normally up the dom tree (causes problems with nested fickle objects.)
      opener:      element/collection/selector,  // the opener receives focus again when `fickleclosed` has been triggered.

      fadein:      0,        // ms fadeIn duration  -- shorthand for .on('fickleopen', function(){ $(this).fadeIn( fadeinMs ) });
      fadeout:     0,        // ms fadeOut duration -- shorthand for .on('fickleclose', function(){ $(this).fadeOut( fadeinMs ) });

      onOpen:      null,     // shorthand for .on('fickleopen', handlerFunc);
      onOpened:    null,     // shorthand for .on('fickleopened', handlerFunc);
      onClose:     null,     // shorthand for .on('fickleclose', handlerFunc);
      onClosed:    null,     // shorthand for .on('fickleclosed', handlerFunc);
    }

    Events:

      fickleopen:    fires before the popup is opened. Cancelable with event.preventDefault()/return false;
      fickleclose:   fires before the popup is closed. Cancelable with event.preventDefault()/return false;
      fickleopened:  fires *after* the popup is opened. Uncancelable.
      fickleclosed:  fires *after* the popup is closed. Uncancelable.

      (Note: for all events `event.cfg` contains an extended instance of the original `options` object.)


    Methods:

      open:    .fickle('open', data)  // Opens (shows) the fickle element and gives it focus.
                                      // `data` is an object, that may contain `opener` element that overwrites/updates the original `options.opener`
                                      // Example:   $(fickleElm).fickle('open', { opener: linkElm });
                                      // `data` may also contain a one-time `silent` flag to suppress focus transfer
                                      // Example:   $(fickleElm).fickle('open', { silent: true });
      close:   .fickle('close')       // Closes (hides) the fickle element, and sends focus back to `options.opener`.
      toggle:  .fickle('toggle'[, doOpen])  // Toggles between 'open'/'close' - Optional: `doOpen` boolean true `open`s, while false `close`s
      isOpen   .fickle('isOpen')      // returns boolean value for the first item in the collection
      isFickle .fickle('isFickle')    // returns boolean value indicating if this element is fickle (has been inited)
      config   .fickle('config')      // returns the fickle config object
      destroy  .fickle('destroy')     // unbinds all events and data set by the plugin. Leaves things otherwise as is.


  FIXME:
    * `lastFocusableLineage` (see below) is fugly
    * In MSIE6&7 clicking the scrollbar closes the window.
    * (?) Fickle element has focus, user switches to another application and then switches back by clicking outside the fickle element.
    * Consider using $.ui.widget() to make code more compact

*/

(function($, doc, undefined){

  var fickle = 'fickle',
      _dataId = fickle+'-'+$.aquireId(),  // obfuscate/privatize fickle datas...

      _popuplock,
      _doClosePopup,
      _cancelTimeout = function (/*e*/) {
          //;;;window.console&&console.log( 'clearing', e, e&&e.type );
          clearTimeout(_popuplock);
        },

      _triggerEvent = function (collection, type, cfg) {
          // NOTE: `collection` must only contain one item - otherwise shared-event-object-weirdness ensues.
          var e = $.Event(fickle+type);
          e.cfg = cfg;
          collection.trigger(e);
          return !e.isDefaultPrevented();
        },


      methods = { // inside method functions `this` is the fickle element jQuery collection.

          open: function (data, extras) {
              var cfg = data.c;
              cfg.opener = (extras && extras.opener) || cfg.opener;
              if ( !data._isOpen  &&  _triggerEvent(this, 'open', cfg) )
              {
                // If the fickle object is the last focusable element in the document
                // then (in FF3 and Chrome, at least) keyboard Tabbing out of the popup will place the focus inside the location bar
                // ...which triggers a document.onblur() (this is identical to what happens when the user Switches away from the browser)
                // ...which ruins everything!
                // Henche, we append a hidden tabindexable element to the document (for the lack of a better idea for a workaround).
                if ( !$('#'+_dataId)[0] ) {
                  $('<i id="'+ _dataId +'" tabindex="0" style="position:fixed;_position:absolute;left:-9999px;overflow:hidden;margin-top:-1px;width:1px;height:1px;"> </i>')
                      .appendTo('body');
                }
                // ...and now onto the actual opening:
                var focusElm = cfg.focusElm,
                    focusTarget = focusElm ?
                                      ( focusElm.charAt ? this.find(focusElm) : focusElm ):
                                      [];
                data._gotFocus = undefined;
                cfg.fickle  &&  $(doc).on('focusin click', data._confirmFocusLeave);
                cfg.closeOnEsc  &&  $(doc).on('keydown', data._listenForEsc);
                data._isOpen = !0;// true
                cfg.fadein  &&  this.fadeIn(cfg.fadein); // because .fadeIn(0) !== .show()
                this
                    .queue(function(){  // to allow event handlers to perform fadeIns and things...
                        var pop = $(this);
                        pop.unhide();
                        _triggerEvent(pop, 'opened', cfg);
                        if ( !data._gotFocus )
                        {
                          var silent =  (extras  &&  extras.silent!==undefined) ?
                                            extras.silent:
                                            cfg.silent;
                          if ( !silent )
                          {
                            $.focusHere(focusTarget[0]||this);
                          }
                        }
                        pop.dequeue();
                      });
              }
            },
          close: function (data, extras) {
              var cfg = data.c;
              if ( data._isOpen  &&  _triggerEvent(this, 'close', cfg) )
              {
                $(doc)
                    .off('focusin click', data._confirmFocusLeave)
                    .off('keydown', data._listenForEsc);
                var silent =  (extras  &&  extras.silent!==undefined) ?
                                  extras.silent:
                                  cfg.silent;
                if ( !silent )
                {
                  $.focusHere(cfg.opener||doc.body);
                }
//                _cancelTimeout(); // to ensure 'trapFocus' doesn't steal the focus back
                data._isOpen = !1;// false
                cfg.fadeout  &&  this.fadeOut(cfg.fadeout); // because .fadeOut(0) !== .hide()
                this
                    .queue(function(){  // to allow event handlers to perform fadeOuts and things...
                        var pop = $(this);
                        pop.hide();
                        _triggerEvent(pop, 'closed', cfg);
                        pop.dequeue();
                      });
              }
            },
          toggle: function(data, extras){
              var doOpen =  typeof extras === 'boolean' ?
                                extras:
                            extras && extras.doOpen !== undefined?
                                extras.doOpen:
                                !data._isOpen;
              methods[doOpen?'open':'close'].call(this, data, extras);
            },
          isOpen: function(data/*, extras */){
              return !!(data && data._isOpen);
            },
          isFickle: function (data) {
              return !!data;
            },
          config: function (data) {
              return data && data.c;
            },
          destroy: function (data) {
              $(doc)
                  .off('focusin click', data._confirmFocusLeave)
                  .off('keydown', data._listenForEsc);
              this
                  .off( '.'+_dataId )
                  .removeData( _dataId );
              // NOTE: We can't remove the focusTrap - as it is shared between fickle elements.
          }
        /**
          disable: _notImplemented,
          enable:  _notImplemented
        /**/
        },

      _defaultConfig = {
          fickle:      !0,// true
          closeOnEsc:  !0,// true
          //focusElm:    null,
          //trapFocus:   false,
          closeDelay:  300
          //startOpen:   false,
          //silent:      false,
          //bubble:      false,
          //opener:      element/collection/selector,
          //fadein:      0,
          //fadeout:     0,
          //onOpen:      null,
          //onOpened:    null,
          //onClose:     null,
          //onClosed:    null,
        };






  $.fn.fickle = function (cfg, extras) {
      var candidates = this;
      if (typeof cfg === 'string')
      {
        // Handle "method" calls
        var methd = methods[cfg];
        if (methd)
        {
          return ( /^(?:config|is(?:Open|Fickle))$/.test(cfg) ) ?
                      methd( candidates.data(_dataId)/*, extras */ ):
                      candidates.each(function(i, _this){
                          _this = $(_this);
                          var _data = _this.data(_dataId);
                          _data  &&  methd.call(_this, _data, extras);
                        });
        }
      }
      else
      {
        cfg = $.beget(_defaultConfig, cfg);

        candidates.each(function(){
            var _this = $(this);

            _this.data(_dataId)  &&  _this.fickle('destroy');

            // Bind onEvent handles specified in cfg.
            $.each(['Open','Opened','Close','Closed'], function (i, Type) {
                var type = fickle+Type.toLowerCase()+'.'+_dataId,
                    handler = cfg['on'+Type];
                !cfg.bubble  &&  _this.on( type, function(e){ e.stopPropagation(); });
                handler  &&  _this.on( type, handler );
              });

            var data = {
                    c: $.beget(cfg),
                    _listenForEsc: function (e) {
                        // return true on non-ESC keypresses, but envoke fickle('close') and return false on ESC.
                        return (e.which !== 27 /* ESC */)  ||  _this.fickle('close') && false;
                      },
                    _confirmFocusLeave: function (e) {
                        var popupElm = _this[0];
                        _doClosePopup = e.target !== popupElm  &&  !$.contains( popupElm, e.target );
                      }

                  },
                _lastFocusElm;

            !cfg.startOpen && _this.hide();  // hide by default - unless cfg.startOpen is true

            _this
                .data(_dataId, data)
                .on('focusin.'+_dataId+' focusout.'+_dataId, function (e) { // keeps track of whether the fickle element has focus. Determines whether .focusHere() is needed on `fickleopened` (see above)
                    data._gotFocus = e.type==='focusin';
                  });

            // if cfg.fickle is set to false, the element becomes a very simple "open/close" window without any "fickly" properties to make it special.
            if (cfg.fickle)
            {
              // popup content virkni
              // close popup
              _this
                  .on('focusout.'+_dataId, function (/*e*/) {
                      var popup = this;
                      _cancelTimeout();
                      //;;;window.console&&console.log( 'focusout' );
                      _doClosePopup = false;
                      _popuplock =  setTimeout(function(){
                                        cfg.trapFocus ?
                                            // FIXME: consider doing more intelligent sensing of from where the focus left, and return it back
                                            $.focusHere(_lastFocusElm):                    // Send focus back into the fickle element
                                            _doClosePopup  &&  $(popup).fickle('close'); // close popup
                                      }, cfg.trapFocus ? 0 : cfg.closeDelay);
                    })
                  // make the popup sticky
                  .on('click.'+_dataId+' mousedown.'+_dataId+' focusin.'+_dataId, function (e) {
                      setTimeout(_cancelTimeout, 0); // because focusout (setting the _popupLock) *might* not fire before this focusin event...?
                      //;;;window.console&&console.log( 'focusin' );
                      if (e.type === 'click')
                      {
                        var popup = $(this);
                        // on 'click' popup looses "focus" so we need to reset the focus once the mouse leaves
                        popup.one('mouseleave.'+_dataId, function(/*e*/){ data._isOpen  &&  $.focusHere(_lastFocusElm); });
                      }
                      else if (e.type === 'focusin')
                      {
                        _lastFocusElm = e.target;
                      }
                    });
            }

            if (cfg.startOpen)
            {
              // NOTE: if _this starts out visible, then fadeIn() fickleopen events will not show.
              // We need, however, to envoke proper .fickle('open') to set the appropriate flags and run the events.
              _this.fickle('open');
            }

          });

      }


      return candidates;
    };

})(jQuery, document);
