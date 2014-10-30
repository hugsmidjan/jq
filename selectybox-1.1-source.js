/* Selectybox 1.1  -- (c) 2012-2014 Hugsmiðjan ehf. - MIT/GPL   @preserve */

// ----------------------------------------------------------------------------------
// Selectybox v 1.1
// ----------------------------------------------------------------------------------
// (c) 2012-2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------
//
// Allows simple styling of <select> boxes in a way that is both accessible and mobile friendly.
//
// ## Usage:
//
//     var mySelect = document.getElementsByTagName('select')[1];
//     var widget = window.Selectybox( select, options );
//     widget.refresh();       // silently refresh the widget
//     widget.val( 'Apple' );  // silently updates <select>'s value + refresh
//     widget.destroy();
//
//     widget.select;    // the original <select> element
//     widget.button;    // the proxy element that contains the value
//     widget.container; // wrapper around both `select` and `button`
//
//     var widget2 = window.Selectybox( select, newOptions );
//     console.log( widget === widget2 ); // true
//
//
//
// ## jQuery/Zepto plugin:
//
//     // (Runs automatically if window.jQuery is detected.)
//     // (Can be run multiple times for different jQuery/Zepto instances.)
//     Selectybox.jQueryPlugin( jQueryOrZeptoObject );
//
//     var mySelect = $('select').first();
//     var widgetContainer = mySelect.selectybox( options );
//
//     mySelect.selectybox('refresh');
//     mySelect.selectybox('val', 'Apple');
//     mySelect.selectybox('destroy');
//
//     var widget = widgetContainer.data('selectybox-widget');
//     console.log( widget === mySelect.data('selectybox-widget') ); // true
//     console.log( widget === mySelect.selectybox() ); // true
//
//
//
//
(function(){'use strict';

  var win = window;
  var w3cEvents = !!win.addEventListener;

  var emptyDiv;

  var events = function ( widget, action ) {
          var doAdd = action === 'add';
          var method = w3cEvents ?
                          (doAdd ? 'add' : 'remove') + 'EventListener':
                          (doAdd ? 'at' : 'de') + 'tachEvent';
          var on = w3cEvents ? '' : 'on';
          var select = widget.select;
          select[method](on+'change', widget._$refresh);
          select[method](on+'keyup',  widget._$refresh);
          select[method](on+'focus',  widget._$focus);
          select[method](on+'blur',   widget._$blur);
        };

   var setStyles = function ( element, styles, doClear ) {
          for ( var cssProp in styles )
          {
            element.style[cssProp] = doClear ? '' : styles[cssProp];
          }
        };

  var optionPropNames = 'templ getButton focusClass emptyVal text wrapperCSS selectCSS'.split(' ');
  var widgetInstanceProps = '_$refresh _$focus _$blur select container button'.split(' ');


  // ====================================================================


  var Selectybox = function ( select, options ) {
          var existingWidget = select.$selectybox;
          var widget = existingWidget || this;

          if ( !(widget instanceof Selectybox) )
          {
            // tolerate cases when new is missing.
            return new Selectybox( select, options );
          }
          else
          {
            if ( existingWidget )
            {
              existingWidget.destroy();
            }

            if ( options )
            {
              var i = 0;
              var prop;
              while ( (prop = optionPropNames[i++]) )
              {
                if ( options[prop] )
                {
                  widget[prop] = options[prop];
                }
              }
              options = null;
            }

            emptyDiv = emptyDiv || document.createElement('div');
            emptyDiv.innerHTML = widget.templ.replace(/^[^<]+/, '');
            var container = widget.container = emptyDiv.firstChild;
            container.style.position = 'relative';

            widget.button = widget.getButton();
            widget.select = select;

            select.parentNode.insertBefore( container, select );
            container.insertBefore( select, widget.button.nextSibling );
            select.style.opacity = 0.0001;
            setStyles( select, widget.selectCSS );


            // a widget-bound event handler-functions.
            widget._$refresh = function () {
                setTimeout(function(){ widget.refresh(); }, 0);
              };
            var _focusClassRe;
            widget._$blur = function () {
                _focusClassRe = _focusClassRe || new RegExp('(?:^| )'+widget.focusClass+'( |$)');
                container.className = container.className.replace(_focusClassRe, '$1');
              };
            widget._$focus = function () {
                container.className += ' '+widget.focusClass;
              };

            events( widget, 'add' );

            widget.refresh();

            select.$selectybox = widget; // dirty: add reference from widget.select back to widget

            if ( existingWidget )
            {
              return widget;
            }
          }
        };



  Selectybox.prototype = {

      // Default options/properties
      templ:       '<span class="selecty"><span class="selecty-button"/></span>',
      getButton:   function () { return this.container.firstChild; },
      focusClass:  'focused',
      emptyVal:    '\u00a0 \u00a0 \u00a0',
      text:        function (txt) { return txt; }, // <-- it's OK to add HTML markup
      selectCSS:   {
          // set necessary styles
          position: 'absolute',
          bottom:   0,
          left:     0,
          width:    '100%',
          height:   '100%',
          // unset existing styles
          top:      'auto',
          right:    'auto',
          margin:   0,
          padding:  0,
          border:   0
        },


      // Methods
      refresh: function () {
          var widget = this;
          var select = widget.select;
          widget.button.innerHTML = widget.text(
              select.options[select.selectedIndex].text.replace(/</g, '&lt;')
            ) || widget.emptyVal;
        },

      val: function ( val ) {
          var widget = this;
          var i = 0;
          var option;
          val += ''; // enforce String type for predictable strict comparison
          while ( (option = widget.select.options[i++]) )
          {
            if ( option.value === val )
            {
              option.selected = true;
              break;
            }
          }
          widget.refresh();
        },

      destroy: function () {
          var widget = this;
          var select = widget.select;
          var container = widget.container;
          var containerParent = container.parentNode;
          // replace <select> + zap container
          containerParent.insertBefore( select, container );
          containerParent.removeChild( container );
          // unbind DOM events
          events( widget, 'remove' );
          // reset <select> style="" props
          select.style.opacity = '';
          setStyles( select, widget.selectCSS, true );
          // release/delete widget props
          select.$selectybox = '';
          var props = optionPropNames.concat( widgetInstanceProps );
          var i = props.length;
          while ( i-- )
          {
            delete widget[ props[i] ];
          }
        }

    };


  // ====================================================================


  Selectybox.jQueryPlugin = function ( $ ) {
      var widgetKey = 'selectybox-widget'; // public
      $.fn.selectybox = function ( options, value ) {
          var selects = this;
          if ( /^(?:refresh|val|destroy)$/.test(options) )
          {
            selects.each(function(){
                var select = $(this);
                var widget = select.data(widgetKey);
                if ( options==='destroy' )
                {
                  select.add(widget.container).removeData(widgetKey);
                }
                widget[options](value); // value is meaningless for all but the .val() method
              });
          }
          else if ( typeof options !== 'string' )
          {
            options = options || {};
            // set icky default .text() method to crudely match default behaviour the old the jQuery plugin
            options.text = options.text || function (text) {
                $(this.container).toggleClass( 'selecty-empty', !text );
                return text;
              };
            return selects.pushStack(
                selects.filter('select').map(function (i,select) {
                    var widget = Selectybox( select, options );
                    $(select).add(widget.container).data(widgetKey, widget);
                    return widget.container;
                  })
              );
          }
          return selects;
        };
    };



  if ( typeof module === 'object'  &&  module.exports )// typeof module.exports === 'object' )
  {
    module.exports = Selectybox;
  }
  else
  {
    win.Selectybox = Selectybox;
    if ( win.jQuery )
    {
      Selectybox.jQueryPlugin( win.jQuery );
    }
  }


})();
