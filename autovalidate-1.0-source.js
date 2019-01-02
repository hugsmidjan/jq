/*! $.fn.autoValidate/.defangEnter/.defangReset  1.0  -- (c) 2009-2014 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// jQuery.fn.autoValidate/.defangEnter/.defangReset  v. 1.0
// ----------------------------------------------------------------------------------
// (c) 2009-2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  NOTE:

    Methods for (temporarily) disabling the autoValidation of forms:
      * `form.data('av.skip', true)`      skips validation on next submit only
      * `form.data('av.disabled', true)`  disables all validation until further notice

*/

(function($){

  $.fn.addBack = $.fn.addBack || $.fn.andSelf;

  var idPrefix = 'tmp_' + (new Date()).getTime();
  var idSuffix = 0;

  var defaultConfig = {

    lang                : 'en',              // Two digit language-code used for displaying error messgages, etc.
    maxLabelLength      : 35,                // Cutoff-character-limit for <label> values listed in the error alert() window.
    errorAction         : 'focus',           // available values: (anchor|focus) (Note: anchor is bound to be more irritating.)
    focusElmClass       : 'stream',          // className for the placeholder <a href=""> element used to move the
                                             // keyboard/screen-reader focus between inline error messages.
    formInvalidClass    : 'is-invalid',     // className toggled on the <form> element whenever $.fn.isValid() runs
    submittedClass      : 'issubmitted',     // className that gets added to the <form> element when it has been
                                             // submitted and is waiting for the server to respond
    validateEachField   : '',                // possible values:  "change"==onChange; (only when errorMsgType: 'inlineonly') ""==onSubmit (normal) ...
    errorMsgType        : 'alertonly',       // How should error texts be displayed?
                                             // Possible values: "alertonly", "inlineonly", "both". Defaults to alertonly.
    inlineErrorClass    : 'errmsg',          // className for the inline "Error" message element
    nextErrorLinkClass  : 'nexterror',       // className for the inline "Next Error" link element

    customReqCheck      : {},                // Container for dynamic "required" checks for based on field @name attribute values.
                                            // Example use:
                                            //     var validationConfig = $.av.config( myform );
                                            //     validateionConfig.customReqCheck = {
                                            //         'fieldName':  'otherFieldname',
                                            //         'fieldName2': '!otherFieldname2'
                                            //         'fieldName3': function(){ /* do stuff */ return booleanValue; }
                                            //       });

    reqClassPattern     : 'req',             // The `className` that designates a field to be "required".
    reqErrorClass       : 'reqerror',        // The `className` put on field "container" elements when they trigger a "required" error.
    typeErrorClass      : 'typeerror',       // The className put on field "container" elements that have a "invalid input" error.

    //emulateTab:         false,
    //includeDisabled:    false,             // true - means that [disabled] fields are not filtered out.
    //maxLengthTab:       false

    defangReset         : true,              // assign a confirmation dialog to reset buttons to prevent accidental resets
    defangEnter         : 'auto',            // disable form submitions on enter key.
                                             // Values are (true|false|auto) where:
                                             //  true  - disables all enter submits,
                                             //  false - doesn't alter bowser defaults,
                                             //  auto  - disables enter submitions if form has more than one submit button
    consumeRequired     : true,              // overtake default browser behaviour of html5 required attibute
    consumeMinlength    : true               // overtake default browser behaviour of html5 minlength attibute
  };


  // autovalidator space
  $.extend({
    av : {
      lang : {
        en : {
          bullet          : ' • ',
          // Header for the list of empty "required" fields in the error alert() window.
          errorReqMsg     : 'Please fill out these fields:\n\n',
          // Header for the list of "invalid value" fields in the error alert() window.
          errorTypeMsg    : 'These fields contain invalid input:\n\n',
          inlineMsgPrefix : 'Error:',                                 // Prefix/header for *all* inline errors.
          inlineReqMsg    : 'This field is required ',                // Default "value required" inline error message.
          inlineTypeMsg   : 'This field contains an invalid value ',  // Default "invalid value" inline error message.
          inlineNextError : 'Next error',                             // Text for the "Next Error" link element.
          resetAlert      : 'Note: You are about to reset all values in the form...'
        }
      },

      id : function ( jq ) {
        jq = $(jq);
        var id = jq.attr('id');
        return (id) ? id : jq.attr('id', idPrefix + '_' + (idSuffix++)).attr('id');
      },

      cleanLabelString : function( t, maxlength ) {

        if (!t) { return ''; }
        maxlength = maxlength || 35;
        t = t.replace(/\s\s+/g, ' ')   // collapse multiple spaces
             .replace(/ - /g, ', ')       // change all " - " seperators into commas
             .replace(/\[/g, '(')         // change all [ into ( to eliminate confusion
             .replace(/\]/g, ')')         // change all ] into ) to eliminate confusion
             .replace(/\([^)]+\)/g, '')   // remove all parenthesis and their content  (NOTE: will not catch nested parenthesis)
             .replace(/[\s*:#]+$/, '')    // remove all spaces, asterixes, and colons from end of line
             .replace(/^[\s*#]+/, '');    // remove all spaces and asterixes from beginning of line

        // enforce maxlength
        if (t.length > (maxlength + 2)) {
          // chop off trailing spaces and punctuation marks
          t = t.substr(0, (maxlength - 2)).replace(/[.,:;\s]+$/, '') + '...';
        }
        return t;
      },

      getLabel : function ( control, contexts, conf ) {

        var input = control.find( ':input:first' );
        var labelData = input.data( 'av-labeltext' );

        if (!labelData) {

          // by default use title attribute as "label"
          labelData = $.av.cleanLabelString( input.attr('title'), conf.maxLabelLength );

          // if there is no title, then we fall back to label
          var id = input.attr('id');
          if (!labelData && id) {
            // label can take the following forms:
            //   input.closest('form').find('label[for={id}]')
            //   input.parent('label')
            //   control.find('label').eq(0)
            var l = input.closest('form').find('label[for='+id+']').text() ||
                    input.parent('label').text() ||
                    control.find('label').eq(0).text();

            labelData = $.av.cleanLabelString( l, conf.maxLabelLength );
          }

          // if this element is a group (has named 1+ siblings contained in fieldset wrapper)
          // the groups heading will override the current label text
          var isGroup = control.is('fieldset') && control.find('input[name="' + input.attr('name') + '"]')[1];
          if (isGroup) {
            var thd = control.find(':header,legend,p').eq(0).text() || control.attr('title');  // move selector to config?
            labelData = (thd) ? $.av.cleanLabelString( thd, conf.maxLabelLength ) : labelData;
          }

          // still no label data? -- control must not have any label or title... fall back to name attribute
          if (!labelData) {
            labelData = input.attr('name');
          }

          // form elements that are contained by fieldset that has a heading
          // additionally get their fieldsets legend/heading in []
          var legendCont = contexts.find('fieldset:has(#'+$.av.id(control)+'):last'),
              legend = legendCont.children(':header,legend,p').eq(0);
          if (legend.length) {
            labelData += ' [' + $.av.cleanLabelString( legend.text()||legendCont.attr('title'), conf.maxLabelLength ) + ']';
          }

          $(input).data( 'av-labeltext', labelData );

        }

        return labelData;

      },

      getText : function( id, lang ) {
        return $.av.getError(id, lang) || $.av.getError(id, 'en') || '';
      },

      getError : function( id, lang ) {
        return ($.av.lang[lang] && $.av.lang[lang][id]) || '';
      },

      config : function ( ctx, config ) {

        var context = $( ctx ),
            form = $( context.closest('form')[0]  ||  context.find('form')[0] );

        if ( config ) { // setting
          form.data( 'av-config', config );
        }
        else { // getting
          config = form.data('av-config');
          if (!config) { // has config?
            config = $.extend( {}, defaultConfig );
            form.data( 'av-config', config );
          }
        }
        return config;
      },

      addInlineLabels : function ( ctrllist ) {

        // we really should examine the whole form for more links as a subsection can
        // be validated and it's final control loose it's last member next link despite
        // there being errors further down the form
        var conf = $.av.config( ctrllist[0] );

        $.each(ctrllist, function(i){

          var ctrl = $( this );
          var lang = ctrl.closest('[lang]').attr('lang');

          // my language?
          ctrl.attr( 'lang', lang );
          // build error
          var errorMessage = $.av.getText( 'inlineReqMsg', lang );
          if (ctrl.is('.' + conf.typeErrorClass)) {  // is it a type error?
            errorMessage = ctrl.data('av-error') || $.av.getText( 'inlineTypeMsg', lang );
          }
          ctrl.prepend( '<strong class="'+ conf.inlineErrorClass +'">'+ errorMessage +'</strong>' );
          if (i < ctrllist.length-1) {
            ctrl.append( '<a href="#' + $.av.id( ctrllist[i+1] ) + '" class="' +
                          conf.nextErrorLinkClass + '">' + $.av.getText( 'inlineNextError', lang ) + '</a>' );
          }

        });

      },

      alertErrors : function ( ctrllist, contexts ) {

        var conf = $.av.config( ctrllist[0] );
        var lang = $( ctrllist[0] ).closest('[lang]').attr('lang');
        $( ctrllist[0] ).attr( 'lang', lang );

        var missing   = [];
        var malformed = [];
        var msg       = '';

        // sort through invalid inputs and build error messages
        $.each(ctrllist, function(){

          var ctrl  = $( this ),
              label = $.av.getLabel( ctrl, contexts, conf ),
              errorMsg = ctrl.data('av-error-short');

          if (errorMsg)
          {
            label += ' ('+errorMsg+')';
          }

          if ( $(this).is('.' + conf.typeErrorClass) ) {  // is it a type error?
            malformed.push( label );
          }
          else {
            missing.push( label );
          }

        });
        var bull = $.av.getText( 'bullet', lang );
        if (missing.length) {
          msg += $.av.getText( 'errorReqMsg', lang ) + bull +
                 missing.join('\n' + bull );
        }
        if (malformed.length) {
          msg += '\n\n';
          msg += $.av.getText( 'errorTypeMsg', lang ) + bull +
                  malformed.join('\n' + bull );
        }
        alert( $.trim( msg ) );
      },

      focusNext : function ( refNode ) {
        // order form elements correctly
        var elms = $(':input').get();  // in the context of form rather than the document ?
        elms = elms.sort(function(a, b){
          var at = (a.tabIndex > 0) ? a.tabIndex : 99999;
          var bt = (b.tabIndex > 0) ? b.tabIndex : 99999;
          return ((at < bt) * -1) + ((at > bt) * 1);
        });
        // find our current one
        var n = $.inArray( refNode, elms );
        // find next control that doesn't have tabindex -1
        while (elms[++n] && elms[n].tabIndex === -1) {}
        // loop to first one if we have no target
        var felm = $( elms[n] || elms[0] );
        setTimeout(function () {
          felm.trigger('focus');
        },1);
        return felm;
      }

    }

  });

  var _defaultCheck      = function ( v/*, w, lang */) { return !!v; },
      _defaultToggleCheck = function (/* v, w, lang */) {
          var inp = $(this),
              checked = inp.closest('form').find('input[name="' + inp.attr('name') + '"]:checked');
          return !!checked[0]  &&  // at least one must be :checked
                  // and if these are :radios, then the :checked must have a non-empty value
                  (!checked.is(':radio') || !!checked.filter(function () { return !!$(this).val(); })[0]);
        };

  // space for types
  $.extend( $.av, {
    type: {
      fi_btn:  function (/* v, w, lang */) { return true; }, // prevents nonsense requirements
      fi_txt:  _defaultCheck,
      fi_sel:  _defaultCheck,
      fi_bdy:  _defaultCheck,
      fi_file: _defaultCheck,
      fi_chk:  _defaultToggleCheck,
      fi_rdo:  _defaultToggleCheck
    }
  });







  // jQuery.fn.constrainNumberInput 1.2  -- (c) 2013 Hugsmiðjan ehf.
  /*
    Usage/options:

      $('input.number')
          .constrainNumberInput({
              arrows: false,  // activate UP/DOWN arrows *crementing the value (respecting min="", max="" and step="" attributes)
              floats: false   // allows typing of "-", "." and "," symbols into the field (no validation performed).
            })

  */
  (function($){

    $.fn.constrainNumberInput = function (opts) {
        opts = !opts ? {} : opts.charAt ? { selector:opts } : opts;
        var selector = opts.selector,
            inputs = this;
        if ( opts.arrows )
        {
          selector ?
              inputs.on('keydown', selector,  arrowCrement).on('focusin', selector, triggerChange):
              inputs.on('keydown',  arrowCrement).on('focusin', triggerChange);
        }
        selector ?
            inputs.on('keypress', selector,  rejectInvalidKeystrokes(opts.floats) ).on('keyup', selector, enforceMinMax):
            inputs.on('keypress',  rejectInvalidKeystrokes(opts.floats) ).on('keyup', enforceMinMax);
        return inputs;
      };

    var
        fieldIsFocused = 'cni_focused',
        fieldIsChanged = 'cni_changed',
        // increment/decrement field value with up/down arrow
        arrowCrement = function (e) {
            var input = this,
                delta = e.which===38 ? // up arrow
                            1:
                        e.which===40 ? // down arrow
                            -1:
                            0;

            input.autocomplete = 'off'; // do this every time since the event might be delegated and the element dynamically added
            if ( delta )
            {
              delta = delta * (input.step || 1) * (e.shiftKey ? 10 : 1);
              var val = parseFloat( input.value );
              var val2 = boundryCheck( input, (val||0) + delta );
              if ( val !== val2 ) // skip unnessesary updates and change events
              {
                input.value = val2;
                var $inp = $(input);
                // trigger "change" immediately - unless the field is focused - then wait for blur like normal
                $inp.data(fieldIsFocused) ?
                    $inp.data(fieldIsChanged, true):
                    $inp.trigger('change');
              }
            }
          },
        triggerChange = function (/*e*/) { // bound on "focus"
            var input = $(this);
            input
                // mark the field as focused.
                .data(fieldIsFocused, true)
                // remove previous blur/change handler just in case.
                .off('.cni')
                // if change happens first - then cancel the blur handler (and remove the focused marker)
                .one('change.cni', function (/*e*/) {
                    input
                        .removeData(fieldIsFocused)
                        .removeData(fieldIsChanged)
                        .off('focusout.cni');
                  })
                // if blur happens first - then wait a while for change to happen naturally
                // and if not (i.e. if input is still marked as focused) then remove the marker
                // and trigger change manually.
                .one('focusout.cni', function (/*e*/) {
                    setTimeout(function(){
                        if ( input.data(fieldIsFocused) && input.data(fieldIsChanged) )
                        {
                          input
                              .removeData(fieldIsFocused)
                              .trigger('change');
                        }
                        input
                            .removeData(fieldIsChanged);
                      }, 100);
                  });
          };

    var extraChars = {
            44: 1, // ,
            45: 1, // -
            46: 1  // .
          };

    var boundryCheck = function (input, num) {
            var min, max;
            var ret = ( input.min  &&  !isNaN(min=parseFloat(input.min))  &&  num < min ) ?
                          min:
                      ( input.max  &&  !isNaN(max=parseFloat(input.max))  &&  num > max ) ?
                          max:
                          num;
            return ret;
          };

    var enforceMinMax = function (/*e*/) {
            var input = this;
            var val = input.value;
            if ( val )
            {
              val = parseFloat( val );
              var val2 = boundryCheck( input, val||0 );
              if ( val !== val2 )
              {
                input.value = val2;
              }
            }
          };

    // reject non-digit character input
    var rejectInvalidKeystrokes =  function ( allowFloats ) {
            return function (e) {
                // Cancel the keypress when
                if (!e.ctrlKey && !e.metaKey &&  // allow copy/paste/
                    e.which  &&                  // key has some keycode (Arrow keys don't on 'keypress') but is
                    e.which!==8  &&              // not Backspace
                    e.which!==13  &&             // not Enter
                    (e.which<48  ||  e.which>57) && // not a Digit (0-9)
                    !(allowFloats && extraChars[e.which]) // allow extra characters when floats are allowed
                    // FIXME: use pattern="" attribute to check for valid input...
                  )
                {
                  e.preventDefault();
                }
              };
          };

  })(jQuery);








  // jq functions
  $.fn.extend({

    // defangReset can may be run against any collection of elements to defang
    // them OR, in case of non reset buttons, turn them into reset buttons.
    defangReset : function () {
      return this.bind('click', function(/* e */){
          var btn = $( this );
          var lang = btn.closest('[lang]').attr('lang') || 'en';
          btn.attr( 'lang', lang );
          if ( confirm($.av.getText( 'resetAlert', lang )) ) {
            // call a reset function if this isn't an actual reset button
            if (btn.attr('type') !== 'reset') {
              btn.closest('form').trigger('reset');
            }
            return true;  // accept the click
          }
          return false;  // cancel the click by default
        });
    },


    defangEnter : function () {
      return this.bind('keydown', function(e){
          var target = e.target;
          return ( e.which !== 13  ||  target.tagName !== 'INPUT'  ||  /^(button|reset|submit)$/i.test(target.type) );
        });
    },

    autoValidate : function ( config ) {

      return this.each(function(){

        var context = $( this ),
            form = $( context.closest('form')[0]  ||  context.find('form')[0] );
        if (!form.length) { return false; }

        var conf = $.extend( {}, defaultConfig, config );
        $.av.config( this, conf );

        // defang reset buttons on this form
        if (conf.defangReset) {
          form.find(':reset').defangReset( conf );
        }

        // disable enter submit for some forms
        if (!conf.emulateTab &&
             conf.defangEnter === true ||
             conf.defangEnter === 'true' ||
             (conf.defangEnter === 'auto' && $(':submit', form).length>1) // form has more than one submit button?
            ) {
          form.defangEnter();
        }

        // turn the enter key into tab for all inputs except textareas, and buttons
        if (conf.emulateTab) {
          form.bind('keydown', function(e){
            if (e.keyCode === 13 &&
                $(e.target).is(':input:not(:button):not(:reset):not(:submit):not(textarea)')) {
              $.av.focusNext( e.target );
              return false;
            }
          });
        }

        // functionality to tab to the next field when maxlength is reached
        if (conf.maxLengthTab) {
          form.bind('keyup', function(e){
            var t = $(e.target);
            var w = e.which;
            // only trigger with keycodes (not scancodes), and where keycode isn't backspace,tab,enter,
            if ( ( w > 0  &&  w!==8  &&  w!==9  &&  w!==13  &&  w!==16  &&  w!==17 ) &&
                 t.attr('maxlength') === t.val().length ) {
              $.av.focusNext( e.target );
            }
          });
          // TODO: consider adding the reverse for backspace
        }

        // consume html5 required
        if (conf.consumeRequired) {
          context.find('[required]').each(function () {
              var wrap = $(this).closest('[class^="fi_"], [class*=" fi_"]');
              if (wrap.length)
              {
                wrap.addClass(conf.reqClassPattern);
                $(this).removeAttr('required');
              }
            });
        }

        // consume html5 minlength
        if (conf.consumeMinlength) {
          context.find('[minlength]').each(function () {
              var wrap = $(this).closest('[class^="fi_"], [class*=" fi_"]');
              if (wrap.length)
              {
                $(this).attr('data-minlength', $(this).attr('minlength'));
                $(this).removeAttr('minlength');
              }
            });
        }

        if ( conf.validateEachField === 'change' && conf.errorMsgType === 'inlineonly' )
        {
          form.bind('change', function (e) {
              $(e.target).isValid();
            });
        }

        form.bind('submit', function(e){
            var f = $( this );
            if ( !f.data('av.skip') || f.data('av.disabled') )
            {
              var c = $.av.config( this );

            // This is a bad idea. User submits form, presses back button, fixes something, and can't resubmit. :-P
            // A workaround to this problem is removing submittedClass on unload. Are there other cases where this is a bad idea?
            // Current status: out of scope for the AV, use a custom handler
            /*
            if ( f.hasClass( c.submittedClass ) ) {
              // don't submit the form. it is already submitted
              return false;
            }
            else {*/
              var valid = f.isValid();
              if ( valid ) {
                // mark this form as submitted
                f.addClass( c.submittedClass );
              }
              else
              {
                // neccessary in jQuery 1.2.6 to prevent forms with inline onsubmit="" attributes returning false getting ignored
                // (not a problem in jQuery 1.3)
                e.preventDefault();
              }
              return valid;
            /*}*/

            }
            f.removeData('av.skip');
          });

      });

    },

    isValid : function ( report ) {

      report = !!(report || report == null);

      var invalids = [],
          errMsgSel = '',
          displayAlert = false;   // trigger alerting if any of the contexts want's one

      this.each(function(){

        var context = $( this ),
            contextInvalids = [],
            validContext = true,
            conf = $.av.config( this );

        displayAlert = displayAlert || /both|alertonly/.test( conf.errorMsgType );

        // purge wrapper of old error notifications

        if ( report ) {
          var errMsgWrap = context.closest('[class^="fi_"], [class*=" fi_"]');
          errMsgSel = errMsgSel || 'strong.' + conf.inlineErrorClass + ', a.' + conf.nextErrorLinkClass;
          errMsgWrap.find( errMsgSel ).remove();
        }

        // find controls that need validation
        var controls = context.is(':input') ? context : context.find(':input');

        controls.not(conf.includeDisabled?'':':disabled').not(':submit,:reset,:button,[type="hidden"]').each(function(){

          var control = $( this );


          // get this control's types (defaulting to fi_txt for everything except checkboxes)
          var tests =  (this.type === 'checkbox') ?
                            { fi_chk: $.av.type.fi_chk }:
                        (this.type === 'radio') ?
                            { fi_rdo: $.av.type.fi_rdo }:
                            { fi_txt: $.av.type.fi_txt },

              wrap =      control.closest('[class^="fi_"], [class*=" fi_"]'),

              lang =      wrap.closest('[lang]').attr('lang'),
              required =  wrap.hasClass( conf.reqClassPattern ) || control.hasClass( conf.reqClassPattern );

          // purge wrapper of old error notifications
          if ( report ) {
            wrap.removeClass( conf.reqErrorClass );
            wrap.removeClass( conf.typeErrorClass );
          }

          if (wrap.length !== 0)
          {
            var c, cls = $.trim( wrap.attr('class') ).split(/\s+/);
            while ( (c = cls.pop()) )
            {
              if (/^fi_/.test(c) && $.isFunction( $.av.type[c] )) {
                tests[c] = $.av.type[c];
              }
            }
          }

          if ( control.is('[data-minlength]') )
          {
            tests.minlength = $.av.type.minlength;
          }

          // extra requirement check
          var name = control.attr('name'),
              reqchk = conf.customReqCheck && conf.customReqCheck[name];
          if ( reqchk && $.isFunction( reqchk ) )
          {
            required = reqchk.call( this,
                                    $.trim( control.val() ),
                                    wrap.get(0) || this,
                                    lang
                                  );
          }
          else if (reqchk && typeof(reqchk) === 'string')
          {
            var m = /^(!)?(.*)$/.exec(reqchk);
            var t = $(':input[name="' + m[2] + '"]', this.form);  // use context rather than form?
            if (t.length)
            {
              required = t.is(':checkbox, :radio') ?
                            !m[1] ^ !t.filter(':checked').length:  // ^ is XOR (either but not both)
                            !m[1] ^ (t.val() === '');
            }
          }

          // are there any extra validations for this field
          // TODO : can this be? is there need for adding custom type checks directly onto the field?
          if (conf.customTypeCheck && $.isFunction( conf.customTypeCheck[name] )) {
            tests[name] = conf.customTypeCheck[name];
          }

          // if tests is empty...

          // control is valid if all type validations are true
          for (var v in tests) {

            wrap.attr( 'lang', lang );

            // rather than doing $.trim( $(this).val() ) within each call...
            // it's out of the loop and into a parameter
            var res = tests[v].call( this,
                                      $.trim( control.val() ), // fetch an updated value each timearound - to allow validation methods to perform normalization/auto-correction.
                                      wrap.get(0)||this,
                                      lang
                                    );

            // react to invalid control
            if ( res !== true ) {

              validContext = false;

              // context.is('fieldset:has(input[name="' + input.attr('name') + '"]:gt(1))');
              //var id = $.av.id( this );

              // returned value was: a string (error message / exception) or Object { inline:'...', alert:'...' }
              var resIsString = typeof res === 'string';
              if ( res || resIsString) {
                // Message should detail how to complete the field
                contextInvalids.push( wrap.get(0) );

                if ( report ) {
                var shortErr;
                // handle Object
                if (!resIsString) {
                  shortErr = res.alert;
                  res = res.inline;
                }
                wrap.data( 'av-error', res );
                wrap.data( 'av-error-short', (typeof shortErr === 'string' ? shortErr : res) );

                // mark wrapper (or control) with error class
                wrap.removeClass( conf.reqErrorClass );
                wrap.addClass( conf.typeErrorClass );
                }

              }
              else if (required) {

                // add a field missing message
                contextInvalids.push( wrap.get(0) );

                // mark wrapper (or control) with error class
                if ( report ) {
                wrap.addClass( conf.reqErrorClass );
                }

              }

            }
          }

        });


        // context ends -- draw inline links for this context if needed
        if (report && /both|inlineonly/.test( conf.errorMsgType )) {
          $.av.addInlineLabels( $.unique( contextInvalids ) );
        }

        invalids = invalids.concat( contextInvalids );  // add this context's invalids to global invalids list

      });

      var isValid = !invalids.length;

      if ( report )
      {
      // we've passed through every control - time to sort out the results
        if ( !isValid )
      {
          var field = $(invalids[0]).find('*').addBack().filter('input, select, textarea');
        field.focusHere ?
            field.focusHere():
        field.setFocus ?
            field.focusHere():
            field[0].focus();

          if (displayAlert) {
            $.av.alertErrors( $.unique( invalids ), this );
      }

        }

        var form = $(invalids).closest('form'),
            conf = form.data('av-config') || {};
        form
            .toggleClass( conf.formInvalidClass||'', !isValid )
            .trigger({
                type:     'autovalidated',
                isValid:  isValid,
                invalids: $(invalids),
              });
      }

      return isValid;

    }

  });

})(jQuery);
// Icelandic translation
jQuery.av.lang.is = {

  bullet:           ' • ',
  errorReqMsg:      'Það þarf að fylla út þessa liði:\n\n',
  errorTypeMsg:     'Þessir liðir eru rangt útfylltir:\n\n',
  inlineMsgPrefix:  'Villa:',
  inlineReqMsg:     'Það þarf að fylla út þennan lið ',
  inlineTypeMsg:    'Þessi liður er rangt út fylltur ',
  inlineNextError:  'Næsta villa',
  resetAlert:       'Ath: Þú ert í þann mund að afturkalla öll innslegin gildi...',

  fi_kt_fyrirt:     'Sláðu inn fyrirtækiskennitölu',
  fi_kt_einst:      'Sláðu inn kennitölu einstaklings',
  fi_email:         { inline: 'Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)',  alert: 'e.g. nafn@domain.is' },
  fi_url:           { inline: 'Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)',  alert: 'e.g. http://www.domain.is' },
  fi_year:          { inline: 'Vinsamlega sláðu inn rétt ártal (dæmi: 1998)',  alert: 't.d. 1998' },
  fi_ccnum_noamex:  'American Express kort virka ekki',
  fi_valuemismatch: 'Staðfesting stemmir ekki',

  minlength:        'Lágmarks stafafjöldi: '

};


(function($){

$.extend($.av.lang.en, {

  fi_kt_fyrirt:     'Only company \'kennitala\'s allowed',
  fi_kt_einst:      'Only people\'s \'kennitala\'s allowed',
  fi_email:         { inline: 'Please provide a valid e-mail address (example: user@example.com)',  alert: 'e.g. user@example.com' },
  fi_url:           { inline: 'Please provide a valid web address (example: http://www.example.is)',  alert: 'e.g. http://www.example.com' },
  fi_year:          { inline: 'Please provide a valid four digit year (example: 1998)',  alert: 'e.g. 1998' },
  fi_valuemismatch: 'Confirmation doesn\'t match',

  minlength:        'Minimum characters: '

});



// control types are plugged into jQuery.av.type
// in:
//    string: the controls current value
//    node: the wrapper control (marked fi_)
//    lang: the language of the control ( or 'en' if none was selected )
//
//    additionally, the context (this) of the function is the input element itself
//
// out:
//   true:   input is valid
//   false:  input is missing
//   string: input is malformed => string is a localized error message
//           or '' if default error is to be used
//

var avTypes = $.av.type;
$.extend(avTypes, {


  fi_kt:  function ( v, w, lang ) {
    if (v) {
      var error = $.av.getError( 'fi_kt', lang ),
           kt = v.replace(/[\s\-]/g, ''); // Allow "-" and " " as delimiting characters (strip them out).
      $( this ).val( kt );
      // remainder must all be numericals, 10 characters, and the last character must be 0 or 9
      // kt must not be a robot
      var robot = /010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(kt);
      if ( robot || !/^\d{9}[90]$/.test(kt) ) {
        return error;
      }
      // Checksum validation
      var x = [3,2,7,6,5,4,3,2,1],
          _summa = 0,
          i = 9;
      while (i--) { _summa += (x[i] * kt.charAt(i)); }
      if (_summa % 11)
      {
        return error;
      }
    }
    return !!v;
  },

  fi_kt_einst:  function ( v, w, lang ) {
      var ret = avTypes.fi_kt.call( this, v, w, lang );
      if ( ret === true )
      {
        v = $(this).val(); // refresh as the .fi_kt check function normalizes the value. :)
        if ( parseInt( v.substr(0,1), 10) > 3 ) // dd + 40 seems to ben the method for generating company 'kennitala's
        {
          ret = $.av.getError( 'fi_kt_einst', lang );
        }
      }
      return ret;
    },


  fi_kt_fyrirt:  function ( v, w, lang ) {
      var ret = avTypes.fi_kt.call( this, v, w, lang );
      if ( ret === true )
      {
        ret = typeof avTypes.fi_kt_einst.call( this, v, w, lang ) === 'string';
        if ( !ret )
        {
          ret = $.av.getError( 'fi_kt_fyrirt', lang );
        }
      }
      return ret;
    },



  // ====[ internet & communication ]====

  fi_email:  function ( v, w, lang ) {
    if (v && !/^[a-z0-9\-._+]+@(?:[a-z0-9\-_]+\.)+[a-z0-9\-_]{2,99}$/i.test(v)) {
      return $.av.getError( 'fi_email', lang );
    }
    return !!v;
  },

  fi_url:  function( v, w, lang ) {
    if (v) {
      if ( /^www\./.test(v) )
      {
        v = 'http://'+v;
        $(this).val(v);
      }
      if ( !/^[a-z]+:\/\/.+\..+$/.test( v ) ||
           /[\(\)<\>\,\"\[\]\\\s]/.test( v ) ) {
        return $.av.getError( 'fi_url', lang );
      }
      return true;
    }
    return false;
  },

  // Returns true if valid telephone number (further development needed)
  fi_tel:  function( v, w/*, lang */) {
    if (v) {
      // This function simply removes all *legal* characters from the string
      // and then returns false if there are any left overs afterwards.
      var m = w.className.match(/(?:^| )fi_tel_min_(\d+)(?: |$)/);
      return  (
                !v.replace( /(?:\s|[\-+()]|\d)/g, '' )  &&
                ( !m  ||  m[1] <= v.replace( /\D/g, '' ).length )
              ) ||
              '';
    }
    return false;
  },


  // Returns true if it approximates an icelandic telephone number
  //  (with or without the +354 country code)
  fi_tel_is:  function( v/*, w, lang */) {
    if (v) {
      return (/^(?:\+354)?\d{7}$/).test( v.replace(/[ -()]/g, '') )  || '';
    }
    return false;
  },


  // Returns true on a valid Icelandic Zip-code ("póstnúmer").
  //   is:  "dæmi: 101",
  //   en:  "example: 101",
  fi_postal_is:  function ( v, w, lang ) {

    if (v) {
      // have no DB -- fallback to a simple 3-digits test
      var codes = $.av.postCodes && $.av.postCodes.is;
      if (!codes) {
        return (/^\d\d\d$/).test( v ) || $.av.getError( 'fi_pnr', lang );
      }
      // have DB and code is present in it --
      else if ( codes[v] ) {
        // report the zone name
        if (this.nodeType) {
          var unit = $( this ).siblings('span.unit');
          if (!unit.length) {
            unit = $('<span class="unit"></span>');
            $( this ).after( unit );
          }
          unit.html( codes[v] );
        }
        return true;
      }
      // have DB but code isn't found in it
      return $.av.getError( 'fi_pnr', lang );

    }
    return false;

  },

  // Returns true on a comma|space|semicolon deliminated list of valid Icelandic Zip-codes ("póstnúmer").
/*
    is:  "dæmi: 101, 107, 105",
    en:  "example: 101, 107, 105",
    delimiter:  ", ",
*/
  fi_pnrs:  function ( v, w, lang ) {
    if ( v ) {
      var pnrs = v.replace(/(^[ ,;]+|[ ,;]+$)/g,'').split(/[ ,;]+/);
      for (var i=0; i < pnrs.length; i++) {
        v = $.av.type.fi_postal_is( pnrs[i], null, lang );
        if (v !== true) {
        return v;  // passes error exception through
        }
      }
      return true;
    }
    return false;
  },




  // ====[ numerics ]====

  // Returns true only on a positive integer value.
  fi_qty:  function( v/*, w, lang */) {
    $( this ).val( v );  // set field to trimmed value
    return !v || /^\d+$/.test(v) || '';
  },

  // Returns true only on any numeric value (floats, negative values, etc.).
  fi_num:  function( v/*, w, lang */) {
    v = v.replace(/^-\s+/, '-').replace(/[,.]$/, '');
    $( this ).val( v );
    return !v || (/\d/.test(v) && /^-?\d*[.,]?\d*$/.test(v)) || '';
  },




  // ====[ dates ]====

  // Returns true on a valid date (dd.mm.yyyy|d/m/yy|etc.).
  // Valid year-range: 1900-2099. one or two digit days and months, two or four digit years.
  fi_year:  function ( v, w, lang ) {
    if (v && !/^(19|20)\d\d$/.test(v)) {
      return $.av.getError( 'fi_year', lang );
    }
    return !!v;
  },

  // Returns true on a valid date (dd.mm.yyyy|d/m/yy|etc.).
  // Valid year-range: 1900-2099. one or two digit days and months, two or four digit years
  //    is:  "dæmi: %format",
  //    en:  "example: %format",
  fi_date:  function ( v, w, lang ) {
    if (v)
    {
      var error = $.av.getError( 'fi_year', lang );

      // has datepicker
      var datePicker = window.datePicker;
      if (datePicker && datePicker.VERSION < 2) {
        var _id = $.av.id( this ),
            _dateUI = datePicker.fields[_id];
        if ( _dateUI ) {
          var _parsedDate = datePicker.parseDate( _id );
          if (!_parsedDate) {
            return error;
          }
          else {
            var _dateStr = datePicker.printDateValue( _parsedDate, _dateUI.dateFormat, lang ).replace( /(^\s+|\s+$)/g, '' );
            if (!_dateUI.caseSensitive) {
              v = v.toLowerCase();
              _dateStr = _dateStr.toLowerCase();
            }
            return (_dateStr === v) || datePicker.printDateValue(new Date(2000,4,27), _dateUI.dateFormat, lang);
          }
        }
      }

      // we can get to here if: we have no datepicker, we have datepicker but no config for this field
      v = v.replace(/[ .\-\/]+/g, '.').replace(/\.(\d\d)$/, '.20$1');
      // $(this).val( v );
      return (/^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/).test(v) || error;

    }
    return !!v;
  },


  // validate a correct time entry
  fi_time:  function ( v, w, lang ) {
    if (v) {
      var error = $.av.getError( 'fi_time', lang );
      if ( (/^([01]?\d|2[01234])(?:[:.]([0-5]\d))?(?:[:.]([0-5]\d))?\s*([ap]\.?m\.?)?$/i).test( v ) ) {
        var h = RegExp.$1,
            m = RegExp.$2 || '00',
            s = RegExp.$3,
            t = (RegExp.$4 + '').replace(/\./g, '').toLowerCase();
        if (t === 'pm') { h = 1*h+12; }
        var timeOK = (h*60*60 + m*60 + (s||0)*60) <= 86400;
        timeOK  &&  $(this).val( h+':'+m+(s?':'+s:'')+t );
        return timeOK || error;
      }
      else {
        return error;
      }
    }
    return !!v;
  },




  // ====[ credit cards ]====


  // Returns true if it looks vaguely like a valid credid card number
  // Fake Credit Card number for testing: 1234-1234-1234-1238
  fi_ccnum:  function ( v, w, lang ) {
    var error = $.av.getError( 'fi_ccnum', lang );
    if (v) {
      // Strip out the optional space|dash delimiters
      var ccNum = v.replace(/[ \-]/g, '');
      // Card numbers can range from 13 to 19 digits - according to Valitor, anno 2016
      if ( !/^\d{13,19}$/.test( ccNum ) ) {
        return error;
      }

      // insert the cleaned up creditcard number back into the field
      $( this ).val( ccNum );

      // Apply Luhn checksum algorithm
      // (https://en.wikipedia.org/wiki/Luhn_algorithm)
      var checkSum = 0;
      var doDouble = false;
      var i = ccNum.length;
      while (i--)
      {
        var num = 1 * ccNum.charAt(i);
        if ( doDouble ) {
          // every-other digit (starting from the last) should
          // be doubled (added twice) and if the doubling results
          // in a two-digit number, then subtract 9 to get the sum of its digits.
          // (i.e. 2 * 6 === 12  ...  1 + 2 === 3 === 12 - 9)
          num += num - (num > 4 ? 9 : 0); // Þversumma!
        }
        doDouble = !doDouble;
        checkSum += num;
      }
      var isValid = (checkSum % 10) === 0;  // checkSum % 10 must be 0
      return isValid || error;
    }
    return !!v;
  },



  // Returns true if valid credid card expiry date (further development needed to check against the current year)
  fi_ccexp:  function ( v, w, lang ) {
    if (v) {
      // accept space and dash, and change them into "/". Then remove all spaces
      v = v.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/, '$1/$2').replace(/\s+/g, '');
      // ...then test against the pattern "mm/yy"
      return (/^(0\d|1[012])\/(\d\d)$/).test(v) || $.av.getError( 'fi_ccexp', lang );
    }
    return !!v;
  },



  fi_sameasprev: function (v, w, lang) {
    v = $(this).val();
    if ( v )
    {
      var allFields = $(this.form).find('.fi_txt>input,select,textarea'),
          pos = allFields.index(this),
          prevVal = pos>0 ? allFields.eq( pos-1 ).val() : '';
      if ( prevVal  &&  v !== prevVal )
      {
        return $.av.getError('fi_valuemismatch', lang);
      }
    }
    return !!v;
  },


  minlength:  function ( v, w, lang ) {
    var minlength = parseInt($(w).find('[data-minlength]').attr('data-minlength'), 10);
    if (v && v.length < minlength) {
      return $.av.getError( 'minlength', lang ) + minlength;
    }
    return !!v;
  }

});


avTypes.fi_pnr = avTypes.fi_postal_is;


})(window.jQuery);
