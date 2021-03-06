// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.zebraLists v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// Requires: jquery 1.3
/*
  Basic usage with config object:
    * $.ontime( config );
    * $('#myid').ontime( config );

    Note: $.ontime() is equal to $(document).ontime();


  Config properties:
    * label      'ontime'  // Alphanumerical id string: ^[a-zA-Z][0-9a-zA-Z-_]+$.
    * interval   10        // defaults to '10ms'  // Accepts Date()s (converted to "milliseconds into the future"), Integers (ms), or Strings (both absolute: "18:50"/"9:07:30" or relative: "1sec"/"2min 15sec"/"1h10m45s")
    * start      null      // Starting time for the timer. Defaults to `interval`.  (Accepts the same formats as the "interval" property).
    * stop       null      // Specifies number of milliseconds until 'end'ing the timer. (Accepts the same formats as the "interval" property)
    * reps       0         // number of repeats before 'end'ing the timer. Default: `0` (infinity) - unless the user specifies `start` and no `interval` in which case the default is `1`
    * collide    'replace' // Decides what happens if another timer with the same label is present. Options:
                                 // * "replace" (Default) Cancels the previous timer and events, replacing it with the current ones.
                                 // * "yield"             Leaves the existing timer and events untouched. (Does nothing!)
                                 // * "updatetimer"       Replaces the existing timer with the new one. Leaves the previous handlers still bound and adds new events, if any, to the mix 
                                 // * "yieldtimer"        Adds new events, but leaves the existing timer untouched (ignores the new timer).
                                 // * "overlay"           Adds events and the new timeout interval to the mix. (Allows complex, out-of-phase timer combos. Whichever `stop` occurs first 'End's the whole thing!)
    * fn         null      // Function to call ontime.  Parameters passed: event, iCount
    * end        null      // Function to call when the timer ends (times/runs out, or gets 'cancel'ed).  Parameters passed: event
    * bubble     true      // indicates whether events should be able to bubble up the DOM tree. If set to true, event bubbling may be cancelled on case by case basis via event.stopPropagation();
    * unbind     true      // indicates whether event handlers should be unbound when the timer ends


  Events:
    All callbacks/functions fed into the .ontime method are event-handlers, and receive an event object as a first parameter.

    * ontime.{myLabel}      // fires whenever the timeout/interval occurs.  // return false; or e.preventDefault(); ends/cancels the timer.
                            // handler params: [ event, iCount, config ]
                            // `this` is either `document` or the jQuery collection item/Element that .ontime was called upon 
    * ontimeend.{myLabel}   // fires when the timer times-/runs out, or gets `end`ed or `cancel`ed.
                            // handler params: [ event, config ]
                            // `this` is either `document` or the jQuery collection item/Element that .ontime was called upon 


  External access to the config object:

    * var myCfg = $.ontime().data('ontime.myLabel');


  Shorthand Syntax:
    Optional shorthand syntax allows a mixture of paramteters in just about any order.

    Here are the shorthand parsing rules:
    * Function is assumed to be an 'ontime.{myLabel}' event handler
    * String is intrepeted as a label (and/or a trickplay command - see below)
    * Number is considered an 'interval'.  (Or 'reps' if there's a second numerical parameter)
    * Object is treated as a 'config' object.
    * Boolean is treated as an noUnbind flag for the 'cancel' trickplay method.
 
    Examples of use:
    * $.ontime( config, fn)
    * $.ontime( label, config );              // (fn contained in config, or previously set via the `.bind()` method )
    * $.ontime( label, config, fn );
    * $.ontime( interval, fn );               // interval must be number (ms)
    * $.ontime( interval, reps, fn );         // interval must be number (ms)
    * $.ontime( label, interval, fn );        // interval must be number (ms)
    * $.ontime( label, interval, reps, fn );  // interval must be number (ms)


  Trickplay Methods:
    * 'pause'   - Freezes the timer and makes note of how long until the next timeout/interval event is supposed to fire.
    * 'resume'  - Resumes from exactly the moment it was 'paused'.
    * 'cancel'  - Clears the timer, removing all timer data and event handlers - unless a boolean `noUnbind` is also supplied.
    * 'end'     - Fires the 'ontimeend' before clearing the timer and removing all timer data and event handlers.

    Default (label: "ontime") timers:
    * $.ontime( "pause" );              
    * $.ontime( "resume" );
    * $.ontime( "cancel"[, !!noUnbind] ); // optional `noUnbind` keeps all event handlers bound.
    * $.ontime( "end"[, !!noUnbind] );
    Labeled timers:
    * $.ontime( "pause", label );
    * $.ontime( "resume", label,  );
    * $.ontime( "cancel", label[, !!noUnbind] );
    * $.ontime( "end", label[, !!noUnbind] );


  Todo:
   * add 'resume' method and a 'ontimestart' event.
   * review + cleanup (if needed) the $(elm).data() structure to simplify and avoid memory leaks/footprint.
  Ideas:
   * for extra precision we should use setTimeout() - instead of setInterval() - and recalculate/recalibrate the delay each time.
     * add `precision: true||false` configuration option to opt into costly time calculations.

*/


(function($, ontime, undefined){

  var _units = {
          h: 3600000,
          m: 60000,
          s: 1000,
          ms: 1
        },

      _F = function(){},
      _beget = $.beget || function (proto, props) {
          _F.prototype = proto;
          return props ? $.extend(new _F, props) : new _F;
        },
      

      ontimeNS = ontime+'.',
      ontimeEnd = ontime+'end.',
      _defaultLabel = ontime, //+(new Date()).getTime(),

      _parseTime = function (value)
      {
        var _millisec = value;  // default to assuming value is a Number (or digit string) (milliseconds)

        if (value  &&  typeof value != 'number')
        {
          if (value.getTime) // if value is a Date - calculate the number of milliseconds it is in the future.
          {
            _millisec = value.getTime() - (new Date()).getTime();
          }
          else // assume string
          {
            // strip spaces and make lowercase
            value = (value+'').replace(/ /g, '').toLowerCase();
            var _result;
            if ( _result = value.match(/^(\d\d?):(\d\d)(:(\d\d))?$/) ) // parse 24 hour clock H:MM:SS or HH:MM
            {
              var _time = new Date();
              //;;;alert([_result[1], _result[2], _result[4]])
              _time.setHours(_result[1]);
              _time.setMinutes(_result[2]);
              _time.setSeconds(_result[4]||0);
              _millisec = _time.getTime() - (new Date()).getTime();
              _millisec += _millisec<0 ? 24*_units.h : 0; // add 24 hrs
            }
            else if (/\d/.test(value))
            {
              if (/[msh]/.test(value)) // parse common time units: "2min", "2m", "2min 30sec", "300ms", "15sec", "15s", "3hrs", "3h", etc.
              {
                _millisec = 0;
                var re =  /([0-9.]+)([msh]s?)\D*/g;
                while ( _result = re.exec(value) )
                {
                  _millisec += Math.round( parseFloat(_result[1]) * ( _units[_result[2]] || 0 ) );
                }
              }
              else
              {
                _millisec = parseInt(value, 10);
              }
            }
          }
        }
        return (typeof _millisec == 'number' && _millisec >= 0) ? _millisec : undefined;  // be strict: only return natural integers or undefined
      };




  $[ontime] = function ()  // shorthand utility function... equivalent to $(document).ontime()
  {
    var _doc = $(document);
    return _doc[ontime].apply(_doc, arguments);
  };
  $[ontime].parse = _parseTime;  // publicize the parse method to make automated testing easier.


  $.fn[ontime] = function()
  {
    if (this.length)
    {
      var A = arguments,
          args = {};
          i = A.length;
      
      // work out the types of all arguments and store them in a type lookup object;
      while (i--)
      {
        var a = A[i],
            type = $.isFunction(a) ? 'f' : (typeof a).substr(0,1), // only store the first two characters of the type (f|s|n|b|o)
            arr = args[type] || (args[type] = []);
        arr.unshift(a);
      }


      if ( args.s &&  /^(cancel|end|pause|resume)$/.test(args.s[0]) ) // Capture and perform trickplay
      {
        var method = args.s[0],
            label = args.s[1] || _defaultLabel,
            _nowTime = (new Date()).getTime(),
            _methodEnd = method=='end';
  
        this.each(function(){
            var _this = $(this),
                _labelData = _this.data(ontimeNS+label+'-data');

            if (_labelData) // if there's no _labelData, then there's no `ontime` timeouts active for this element, and therefore no need to do anything!
            {
              var i = _labelData.length,
                  _type, _data;
              while (_data = _labelData[--i])
              {
                _type = _data._hasStarted ? 'Interval' : 'Timeout';

                if (method=='resume')
                {
                  _data._ref = window['set'+_type](_data._handler, _data._nextMs-_data._elapsedLap);
                  if (_data._untilFn)
                  {
                    _data._untilRef = setTimeout(_data._untilFn,  _data._untilMs-_data._elapsedTime);
                  }
                }
                else
                {
                  window['clear'+_type]( _data._ref );
                  if (_data._untilRef)
                  {
                    clearTimeout(_data._untilRef);
                    _data._untilRef = undefined;
                  }
                }
                if (method=='pause')
                {
                  _data._elapsedLap  = _nowTime - _data._startLap;
                  _data._elapsedTime = _nowTime - _data._startTime; // strictly speaking only ever used when _data._untilRef is defined
                }
              }
              if (method=='cancel' || _methodEnd)
              {
                _labelData.length = 0;
                _methodEnd  &&  _this.trigger( ontimeEnd+label, _this.data(ontimeNS+label) );
                _this.removeData( ontimeNS+label );
                // unBind all handlers
                // ...but, allow the mysterious `noUnbind` paramter to block the default unbinding of event handlers 
                // (super useful for collision handling when, config.collide == 'updatetimer')
                if ( !args.b  ||  !args.b[0] )
                {
                  _this.unbind( ontimeNS+label );
                  _this.unbind( ontimeEnd+label );
                }
              }
            }

          });
      }
      else // Prepare to set timer
      {
        var config = (args.o && args.o[0]) || {},
            fn = args.f && args.f[0];

        if (args.s) { config.label = args.s[args.s.length-1]; }
        if (args.n)
        {
          config.interval = args.n[0];
          if (args.n.length>1) { config.reps = args.n[1]; }
        }

        // Normalize the config and set sensible defaults.
        config = $.extend({
            label: _defaultLabel,
            reps:  0,
            unbind: 1
          },
          config);

        config.interval = _parseTime(config.interval);
        config.start    = _parseTime(config.start);
        config.stop     = _parseTime(config.stop);

        if (config.interval == undefined)
        {
          config.interval = 10;  // 10 seems like a sensibly fast "default" minimum.
          if (config.start)
          {
            config.interval = config.start; // FIXME: figure out why we're doing this and write comment?
            config.reps = config.reps || 1;  // if user specifies `start` but no `interval` - default `reps` to 1 (same as setTimeout())
          }
        }
        if (config.start == undefined)
        {
          config.start = config.interval;
        }

        var label = config.label;

        // Run! Run!
        this.each(function(){
            var _this = $(this),
                _labelData = _this.data(ontimeNS+label+'-data'),
                _counter = 0,
                _collission = !!_labelData,
                _collideHow = config.collide;

            if (!_labelData)
            {
              _labelData=[];
              _this.data(ontimeNS+label+'-data', _labelData);
            }

            // handle collisions "replace" (default) and "yield"
            if (_collission)
            {
              if (!_collideHow || _collideHow == 'replace')
              {
                _this[ontime]('cancel', label);  // by default replace the old timer and events with the new ones!
              }
              else if (_collideHow == 'yield')
              {
                return; // Return immediately. Add no events or timers. Do nothing!
              }
            }

            // hook up the events - regardless of yielding options
            config.fn  &&  _this.bind( ontimeNS+label, config.fn );
            config.end  &&  _this.bind( ontimeEnd+label, config.end );
            fn &&  _this.bind( ontimeNS+label, fn );

            // handle collisions "yieldtimer", "updatetimer" and "overlay"
            if (_collission && _collideHow)
            {
              if (_collideHow == 'yieldtimer') { return; } // return now to leave the existing timer untouched.
              else if (_collideHow == 'updatetimer') { _this[ontime]('cancel', label, true); } // remove the previous timer settings (to be replaced with the current ones.)
              // else assume _collideHow == 'overlay' - which means we just continue and add the new timeout interval to the mix. (Allowing complex overlapping out-of-phase timers!)
            }

            var _data = {/* precise: config.precise */},
                _innerHandler = function ()
                  {
                    _data._startLap = (new Date()).getTime();
                    var e = $.Event(ontimeNS+label);
                    if ( !config.bubble )
                    {
                      _this.one(e.type, function(e){ e.stopPropagation() }); // needed because of http://bugs.jquery.com/ticket/10699
                    }
                    _this.trigger( e, [_counter, _this.data(ontimeNS+label)] );
                    if (e.isDefaultPrevented()  ||  (config.reps !== 0  &&  ++_counter >= config.reps) )
                    // if the event handler returns `false` the timer should stop
                    {
                      _this[ontime]('end', label, !config.unbind);
                    }
                  },
                _handler = _data._handler = function () {
                    _data._handler = _innerHandler;
                    _data._hasStarted = 1;
                    _data._nextMs = config.interval;
                    _data._ref =  setInterval(_innerHandler, config.interval);  // NOTE: for extra precisiion we should use setTimeout() and recalculate/recalibrate the delay each time
                    _innerHandler();
                  };
            _data._nextMs = config.start;
            _data._ref = setTimeout(_handler, config.start);
            _data._startTime = _data._startLap = (new Date()).getTime();
            _data._elapsedTime = _data._elapsedLap = 0;

            if (config.stop)
            {
              _data._untilMs = config.stop;
              _data._untilFn = function(){ _this[ontime]('end', label, !config.unbind); };
              _data._untilRef = setTimeout(_data._untilFn, config.stop);
            }

            _labelData.push(_data);
            _this.data( ontimeNS+label, _beget(config) )

          });

      }
    }
    return this;
  };


})(jQuery, 'ontime');
