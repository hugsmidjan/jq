/* Selectybox 1.0  -- (c) 2012-2015 Hugsmiðjan ehf. - MIT/GPL   @preserve */

// (c) 2012-2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------

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
          select[method](on+'keyup', widget._$refresh);
          select[method](on+'focus', widget._$focus);
          select[method](on+'blur', widget._$blur);
        };

   var setStyles = function ( element, styles, doClear ) {
          for ( var cssProp in styles )
          {
            element.style[cssProp] = doClear ? '' : styles[cssProp];
          }
        };

  var optionPropNames = 'templ getButton focusClass emptyVal text selectCSS'.split(' ');
  var widgetInstanceProps = '_$refresh _$focus _$blur select container button'.split(' ');


  // ====================================================================


  var Selectybox = function ( select, options ) {
          var existingWidget = Selectybox.getWidget( select );
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

            var _disabled = false;
            var _disbabledClassRe;
            widget._$able = function () {
                var disabled = select.disabled;
                var className = container.className;
                if ( _disabled !== disabled )
                {
                  _disabled = disabled;
                  if ( _disabled ) {
                    _disbabledClassRe = _disbabledClassRe || new RegExp('(?:^| )'+widget.disabledClass+'( |$)');
                  }
                  container.className = _disabled ?
                      className+' '+widget.disabledClass:
                      className.replace(_disbabledClassRe, '$1');
                }
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
      templ: '<span class="selecty"><span class="selecty-button"/></span>',
      getButton: function () { return this.container.firstChild; },
      focusClass: 'focused',
      disabledClass: 'disabled',
      emptyVal: '\u00a0 \u00a0 \u00a0',
      text: function (txt) { return txt; }, // <-- it's OK to add HTML markup
      selectCSS: {
          // set necessary styles
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // unset existing styles
          top: 'auto',
          right: 'auto',
          margin: 0,
          padding: 0,
          border: 0
        },


      // Methods
      refresh: function () {
          this._$able();
          this.val();
        },

      val: function ( val ) {
          var widget = this;
          var select = widget.select;
          if ( val!=null )
          {
            val += ''; // enforce String type for predictable strict comparison
            var i = 0;
            var option;
            while ( (option = select.options[i++]) )
            {
              if ( option.value === val )
              {
                option.selected = true;
                break;
              }
            }
          }
          widget.button.innerHTML = widget.text(
              select.options[select.selectedIndex].text.replace(/</g, '&lt;')
            ) || widget.emptyVal;
        },

      disable: function ( disabled ) {
          this.select.disabled = disabled!==false;
          this._$able();
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
      $.fn.selectybox = function ( options, value ) {
          var selects = this;
          if ( /^(?:refresh|val|destroy|widget)$/.test(options) )
          {
            selects.each(function(){
                var widget = Selectybox.getWidget(this);
                if ( widget )
                {
                  if ( options === 'widget' )
                  {
                    return widget;
                  }
                  widget[options](value); // value is actually meaningless for all but the .val() method
                }
              });
          }
          else if ( typeof options !== 'string' )
          {
            options = options || {};
            // set icky default .text() method to crudely match default behaviour the old the jQuery plugin
            options.text = options.text || function (text) {  // this === widget
                $(this.container).toggleClass( 'selecty-empty', !$(this.select).val() );
                return text;
              };
            return selects.pushStack(
                selects.filter('select').map(function (i,select) {
                    return Selectybox( select, options ).container;
                  })
              );
          }
          return selects;
        };
    };

  Selectybox.getWidget = function ( select ) {
      return select.$selectybox;
    };



  if ( typeof module === 'object'  &&  module.exports )// typeof module.exports === 'object' )
  {
    module.exports = Selectybox;
  }
  else
  {
    win.Selectybox = Selectybox;
  }
  var jQuery = win.jQuery;
  jQuery  &&  !jQuery.fn.selectybox  &&  Selectybox.jQueryPlugin( jQuery );


})();
