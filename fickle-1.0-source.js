/*
  Depends on eutils:
      $.fn.setFocus()
      $.beget()

  Usage:
  
    Turn any element into a ficle/volatile popup with open/close method (+ events) that will automatically close on focusout.

      $('<div class="mypopup">Content</div>').fickle( options );
    
    defaultOptions: {
      focusTarget: '<a href="#" class="focustarget">.</a>',  // may be element or selector - gets prepended to the popup element to receive keyboard focus
      closeOnEsc:  true,     // set to false to disable keyboard "Esc" keypress to run  .fickle(`close`)
      closeDelay:  300,      // Specifies a "grace period" before a `focusout` causes a .fickle(`close`).
      startOpen:   false     // Instantly shows and `open`s the fickle element.  No fadeIns or any fancy effects.
      opener:      element/collection/selector,  // the opener receives focus again when `fickleclosed` has been triggered.

      fadein:      0,        // ms fadeIn duration  -- shorthand for .bind('fickleopen', function(){ $(this).fadeIn( fadeinMs ) });
      fadeout:     0,        // ms fadeOut duration -- shorthand for .bind('fickleclose', function(){ $(this).fadeOut( fadeinMs ) });

      onOpen:      null,     // shorthand for .bind('fickleopen', handlerFunc);
      onOpened:    null,     // shorthand for .bind('fickleopened', handlerFunc);
      onClose:     null,     // shorthand for .bind('fickleclose', handlerFunc);
      onClosed:    null,     // shorthand for .bind('fickleclosed', handlerFunc);
    }

    Events:  (for all events `event.cfg` contains an extended instance of the original `options` object.)

      fickleopen:    fires before the popup is opened. Cancelable with event.preventDefault()/return false;
      fickleclose:   fires before the popup is closed. Cancelable with event.preventDefault()/return false;
      fickleopened:  fires *after* the popup is opened. Uncancelable.
      fickleclosed:  fires *after* the popup is closed. Uncancelable.


    Methods:

      open:    .fickle('open', data)  // Opens (shows) the fickle element and gives it focus.
                                      // `data` is an object, that may contain `opener` element that overwrites/updates the original `options.opener`
                                      // Example:   $(fickleElm).fickle('open', { opener: linkElm });
      close:   .fickle('close')       // Closes (hides) the fickle element, and sends focus back to `options.opener`.
      isOpen   .fickle('isOpen')      // returns boolean value for the first item in the collection

  FIXME: 
    * Fickle element has focus, user switches to another application and then switches back by clicking outside the fickle element.
    * Consider using $.ui.widget() to make code more compact

*/

(function($){

  var _wasEventSuccessful = function(collection, type, evExtras){  
          // NOTE: `collection` must only contain one item - otherwise shared-event-object-weirdness ensues.
          var e = $.Event(type);
          evExtras && $.extend(e, evExtras);
          collection.trigger(e); // this will bubble! ...unless handlers call e.stopPropagation()!
          return !e.isDefaultPrevented();
        },

      _document = document,
      fickle = 'fickle',

      _popuplock,
      _doClosePopup,
      _cancelTimeout = function(e){
          //;;;window.console&&console.log( 'clearing', e, e&&e.type );
          clearTimeout(_popuplock);
        },

      _notImplemented = function(/* data, extras */){ alert('method not implemented yet.'); },

      methods = {
          open: function (data, extras) {
              var cfg = data.c;
              cfg.opener = (extras && extras.opener) || cfg.opener;
              if ( !data._isOpen  &&  _wasEventSuccessful(this, fickle+'open', { cfg: cfg }) )
              {
                $(_document).bind('focusin', data._confirmFocusLeave);
                cfg.closeOnEsc  &&  $(_document).bind('keydown', data._listenForEsc);
                data._isOpen = !0;// true
                this
                    .fadeIn(cfg.fadein||0) // assuming that .fadeIn(0) is equivalient to .show()
                    .queue(function(){  // to allow event handlers to perform fadeIns and things...
                        $(this)
                            .setFocus()
                            .trigger({ type:fickle+'opened', cfg: cfg })
                            .dequeue();
                      });
              }
            },
          close: function (data/*, extras */) {
              var cfg = data.c;
              if (!this.height()) { this.height(1) } // FIXME: remove this IE hack for jQuery 1.3.2 show/hide bug when version 1.3.3 is out!
              if ( data._isOpen  &&  _wasEventSuccessful(this, fickle+'close', { cfg: cfg }) )
              {
                $(_document)
                    .unbind('focusin', data._confirmFocusLeave)
                    .unbind('keydown', data._listenForEsc);
                $(cfg.opener||_document.body).setFocus();
                data._isOpen = !1;// false
                this
                    .fadeOut(cfg.fadeout||0) // assuming that .fadeOut(0) is equivalient to .hide()
                    .queue(function(){  // to allow event handlers to perform fadeOuts and things...
                        $(this)
                            .trigger({ type:fickle+'closed', cfg: cfg })
                            .dequeue();
                      });
              }
            },
          isOpen: function(data/*, extras */){
              return data._isOpen;
            },
          disable: _notImplemented,
          enable:  _notImplemented,
          destroy: _notImplemented
        },

      _defaultConfig = {
          focusTarget: '<a href="#" class="focustarget">.</a>',
          closeOnEsc:  true,
          //trapFocus:   false,
          closeDelay:  300
          //startOpen:   false,
          //opener:      element/collection/selector,
          //fadein:      0,
          //fadeout:     0,
          //onOpen:      null,
          //onOpened:    null,
          //onClose:     null,
          //onClosed:    null,
        },

      _dataId = fickle+'-'+$.aquireId();  // obfuscate/privatize fickle datas...





  $.fn.fickle = function (cfg, extras) {

      if (typeof cfg == 'string')
      {
        // Handle "method" calls
        var methd = methods[cfg];
        if (methd)
        {
          return (cfg == 'isOpen') ?
                      methd( this.data(_dataId)/*, extras */ ):
                      this.each(function(){
                          var _this = $(this);
                          methd.call(_this, _this.data(_dataId), extras);
                        });
        }
      }
      else
      {
        cfg = $.beget(_defaultConfig, cfg);

        var _popups = this;

        // Bind onEvent handles specified in cfg.
        $.each(['Open','Opened','Close','Closed'], function (i, type) {
            cfg['on'+type] && _popups.bind(fickle+type.toLowerCase(), cfg['on'+type]);
          })

        _popups.each(function(){
            var _this = $(this),
                data = {
                    c: $.beget(cfg),
                    _listenForEsc: function (e) {
                        // return true on non-ESC keypresses, but envoke fickle('close') and return false on ESC.
                        return (e.which != 27 /* ESC */)  ||  _this.fickle('close') && false;
                      },
                    _confirmFocusLeave: function (e) {
                        var popupElm = _this[0];
                        _doClosePopup = e.target != popupElm  &&  $(e.target).parents().index(popupElm)==-1;
                      }

                  },
                _lastFocusElm;

            _this
                .data(_dataId, data)
                .toggle( !!cfg.startOpen )  // hide by default - unless cfg.startOpen is true
                // accessibility aid
                .prepend( cfg.focusTarget )
                // popup content virkni
                // close popup
                .bind('focusout', function (e) {
                    var popup = this;
                    _cancelTimeout();
                    //;;;window.console&&console.log( 'focusout' );
                    _doClosePopup = false;
                    _popuplock =  setTimeout(function(){
                                      cfg.trapFocus ?
                                          // FIXME: consider doing more intelligent sensing of from where the focus left, and return it back
                                          $.setFocus(_lastFocusElm):                    // Send focus back into the fickle element
                                          _doClosePopup  &&  $(popup).fickle('close'); // close popup
                                    }, cfg.trapFocus ? cfg.closeDelay : 0); 
                  })
                // make the popup sticky
                .bind('click mousedown focusin', function (e) {
                    setTimeout(_cancelTimeout, 0); // because focusout (setting the _popupLock) *might* not fire before this focusin event...?
                    //;;;window.console&&console.log( 'focusin' );
                    if (e.type == 'click')
                    {
                      var popup = $(this);
                      // on 'click' popup looses "focus" so we need to reset the focus once the mouse leaves
                      popup.one('mouseleave', function(e){ $.setFocus(_lastFocusElm); });
                    }
                    else if (e.type == 'focusin')
                    {
                      _lastFocusElm = e.target;
                    }
                  });

            if (document.body == _this.closest('body')[0])
            {
              // FIXME: this is an ugly hack. let's find a more elegant solution to this.
              var lastFocusableLineage = $('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();
                    // check if the 
              // FIXME: this is an ugly hack. let's find a more elegant solution to this.
              if ( lastFocusableLineage.index(this) > -1 )
              {
                // Established: The popup contains the document's last Link.
                // ...which means (at least in FF3 and Chrome) that Keyboard Tabbing out of the popup will place the focus inside the location bar
                // ...which triggers a document.onblur() (this is identical to what happens when the user Switches away from the browser)
                // ...which ruins everything!
                // Henche, we append a hidden link to the document (for the lack of a better idea for a workaround).
                $('body').append('<a href="#" style="position:fixed;_position:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>');
              }
            }

            if (cfg.startOpen) 
            {
              // NOTE: _this has already been toggled visible (via `.toggle(!!cfg.startOpen)` above)
              // - so fadeIn() fickleopen events will not show.
              // We need, however, to envoke proper .fickle('open') to set the appropriate flags and run the events.
              _this.fickle('open')
            }

          });

      }


      return this;
    };

})(jQuery);
