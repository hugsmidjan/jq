/*
  Depends on eutils:
      $.fn.setFocus()
      $.beget()

  Usage:
  
    Turn any element into a ficle/volatile popup with open/close method (+ events) that will automatically close on focusout.

      $('<div class="mypopup">Content</div>').fickle( options );
    
    defaultOptions: {
      focusTarget: '<a href="#" class="focustarget">.</a>',
      activeClass: 'fickle-active',
      closeOnEsc:  true,
      closeDelay:  100,
      startOpen:   false
      opener:      element/collection/selector,
    }

    Events:

      fickleopen:    fires before the popup is opened. Cancelable with event.preventDefault()/return false;
      fickleclose:   fires before the popup is closed. Cancelable with event.preventDefault()/return false;
      fickleopened:  fires *after* the popup is opened. Uncancelable.
      fickleclosed:  fires *after* the popup is closed. Uncancelable.


    Methods:

      open:    .fickle('open')
      close:   .fickle('close')
      isOpen   .fickle('isOpen')  // returns boolean value for the first item in the collection

  FIXME: 
    * Consider using $.ui.widget() to make code more compact

*/

(function($){

  var _wasEventSuccessful = function(collection, type, evExtras){
         var e = $.extend($.Event(type), evExtras||{});
         collection.trigger(e);
         return !e.isDefaultPrevented();
        },

      _document = document,

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
              if (_wasEventSuccessful(this, 'fickleopen', { cfg: cfg }))
              {
                this.queue(function(){ $(this).show().setFocus().dequeue(); });  // to allow event handlers to perform fadeIns and things...
                $(_document).bind('focusin', data._confirmFocusLeave);
                cfg.closeOnEsc && $(_document).bind('keydown', data._listenForEsc);
                data._isOpen = !1;// false
                this.trigger({ type:'fickleopened', cfg: cfg });
              }
            },
          close: function (data/*, extras */) {
              var cfg = data.c;
              if (_wasEventSuccessful(this, 'fickleclose', { cfg: cfg }))
              {
                $(_document).unbind('keydown', data._listenForEsc);
                $(_document).unbind('focusin', data._confirmFocusLeave);
                $(cfg.opener||_document.body).setFocus();
                this.queue(function(){ $(this).hide().dequeue(); });  // to allow event handlers to perform fadeOuts and things...
                data._isOpen = !0;// true
                this.trigger({ type:'fickleclosed', cfg: cfg });
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
          activeClass: 'fickle-active',
          closeOnEsc:  true,
          closeDelay:  300,
          //startOpen:   false,
          //opener:    element/collection/selector,
          focusTarget: '<a href="#" class="focustarget">.</a>'
        },

      _dataId = 'fickle-'+$.aquireId();  // obfuscate/privatize fickle datas...





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


        this.each(function(){
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

                  };

            _this
                .data(_dataId, data)
                .toggle( cfg.startOpen )
                .addClass( cfg.activeClass )
                // accessibility aid
                .prepend( cfg.focusTarget )
                // popup content virkni
                // close popup
                .bind('focusout', function (e) {
                    var popup = this;
                    _cancelTimeout();
                    //;;;window.console&&console.log( 'focusout' );
                    _doClosePopup = false;
                    _popuplock = setTimeout(function(){
                                      _doClosePopup  &&  $(popup).fickle('close');
                                    }, cfg.closeDelay); // close popup
                  })
                // make the popup sticky
                .bind('click mousedown focusin', function (e) {
                    setTimeout(_cancelTimeout, 0);
                    //;;;window.console&&console.log( 'focusin' );
                    if (e.type == 'click')
                    {
                      var popup = $(this);
                      // on 'click' popup looses "focus" so we need to reset the focus once the mouse leaves
                      popup.one('mouseleave', function(e){ popup.setFocus(); });
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
                // Established: The popup contains the document's last Link
                // ...which means (at least in FF3 and Chrome) that Keyboard Tabbing out of the popup will place the focus inside the location bar
                // ...which triggers a document.onblur() (this is identical to what happens when the user Switches away from the browser)
                // ...which ruins everything!
                // Henche, we append a hidden link to the document (for the lack of a better idea for a workaround).
                $('body').append('<a href="#" style="position:fixed;_position:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>');
              }
            }

            if (cfg.startOpen)
            {
              _this.fickle('open')
            }

          });
      }


      return this;
    };

})(jQuery);
