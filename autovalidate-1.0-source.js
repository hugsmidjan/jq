// ----------------------------------------------------------------------------------
// jQuery.fn.autoValidate/.defangEnter/.defangReset  v. 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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
    submittedClass      : 'issubmitted',     // className that gets added to the <form> element when it has been
                                             // submitted and is waiting for the server to respond
    validateEachField   : '',                // possible values:  "change"==onChange; ""==onSubmit (normal)
    errorMsgType        : 'alertonly',       // How should error texts be displayed?
                                             // Possible values: "alertonly", "inlineonly", "both". Defaults to alertonly.
    inlineErrorClass    : 'errmsg',          // className for the inline "Error" message element
    nextErrorLinkClass  : 'nexterror',       // className for the inline "Next Error" link element

    customReqCheck      : {},                // Container for dynamic "required" checks for based on field @name attribute values.
    reqClassPattern     : 'req',             // The `className` that designates a field to be "required".
    reqErrorClass       : 'reqerror',        // The `className` put on field "container" elements when they trigger a "required" error.
    typeErrorClass      : 'typeerror',       // The className put on field "container" elements that have a "invalid input" error.

    //emulateTab:         false,
    //includeDisabled:    false,             // true - means that [disabled] fields are not filtered out.
    //maxLengthTab:       false

    defangReset         : true,              // assign a confirmation dialog to reset buttons to prevent accidental resets
    defangEnter         : 'auto'             // disable form submitions on enter key.
                                             // Values are (true|false|auto) where:
                                             //  true  - disables all enter submits,
                                             //  false - doesn't alter bowser defaults,
                                             //  auto  - disables enter submitions if form has more than one submit button
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
          var isGroup = control.is('fieldset') && control.find('input[name=' + input.attr('name') + ']')[1];
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
        while (elms[++n] && elms[n].tabIndex === -1) {""}
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
              checked = inp.closest('form').find('input[name=' + inp.attr('name') + ']:checked');
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
  (function($){

    $.fn.constrainNumberInput = function (opts) {
        var selector = opts && (opts.selector || (opts.charAt && opts));
        if ( selector )
        {
          this
              .on('keydown',  selector, arrowCrement)
              .on('keypress', selector, rejectInvalidKeystrokes);
        }
        else
        {
          this
              .on('keydown',  arrowCrement)
              .on('keypress', rejectInvalidKeystrokes);
        }
        return this;
      };

    var
        // increment/decrement field value with up/down arrow
        arrowCrement = function (e) {
            var input = this,
                delta = e.which===38 ? // up arrow
                            1:
                        e.which===40 ? // down arrow
                            -1:
                            0;
            if ( delta )
            {
              delta = delta * (input.step || 1) * (e.shiftKey ? 10 : 1);
              var min,max,
                  val = (parseInt( $.trim(input.value), 10 )|| 0) + delta;
              val = (delta<0 && input.min && !isNaN(min=parseInt(input.min,10)) ) ?
                        Math.max(val, min):
                    (delta>0 && input.max && !isNaN(max=parseInt(input.max,10)) ) ?
                        Math.min(val, max):
                        val;
              input.value = val;
              $(input)
                  .one('blur', function(/*e*/){
                      $(this).trigger('change');
                    });
            }
          },

        // reject non-digit character input
        rejectInvalidKeystrokes =  function (e) {
            // Cancel the keypress when
            if (!e.ctrlKey && !e.metaKey &&  // allow copy/paste/
                e.which  &&                  // key has some keycode (Arrow keys don't on 'keypress') but is
                e.which!==8  &&              // not Backspace
                e.which!==13  &&             // not Enter
                (e.which<48  ||  e.which>57) // not a Digit (0-9)
                // FIXME: use pattern="" attribute to check for valid input...
              )
            {
              e.preventDefault();
            }
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

      // TODO : validateEachField is missing

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

/* delete?
        if (/blur|change/.test(conf.validateEachField)) {
          // $( this ).isValid();
          // what context should the validation be called on?
        }
*/

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
        errMsgSel = errMsgSel || 'strong.' + conf.inlineErrorClass + ', a.' + conf.nextErrorLinkClass;
        context.find( errMsgSel ).remove();

        // find controls that need validation
        var controls = context.is(':input') ? context : context.find(':input');

        controls.not(conf.includeDisabled?'':':disabled').not(':submit,:reset,:button').each(function(){

          var control = $( this );
          control.removeData( 'av-malformed' );

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
          wrap.removeClass( conf.reqErrorClass );
          wrap.removeClass( conf.typeErrorClass );

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
            var t = $(':input[name=' + m[2] + ']', this.form);  // use context rather than form?
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

              // context.is('fieldset:has(input[name=' + input.attr('name') + ']:gt(1))');
              //var id = $.av.id( this );

              // returned value was: a string (error message / exception) or Object { inline:'...', alert:'...' }
              var resIsString = typeof res === 'string';
              if ( res || resIsString) {
                // Message should detail how to complete the field

                var shortErr;
                // handle Object
                if (!resIsString) {
                  shortErr = res.alert;
                  res = res.inline;
                }
                contextInvalids.push( wrap.get(0) );
                wrap.data( 'av-error', res );
                wrap.data( 'av-error-short', (typeof shortErr === 'string' ? shortErr : res) );

                // mark wrapper (or control) with error class
                wrap.removeClass( conf.reqErrorClass );
                wrap.addClass( conf.typeErrorClass );

              }
              else if (required) {

                // add a field missing message
                contextInvalids.push( wrap.get(0) );

                // mark wrapper (or control) with error class
                wrap.addClass( conf.reqErrorClass );

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

      // we've passed through every control - time to sort out the results
      if ( invalids.length )
      {
        var field = $(invalids[0]).find('*').addBack().filter('input, select, textarea');
        field.focusHere ?
            field.focusHere():
        field.setFocus ?
            field.focusHere():
            field[0].focus();
      }
      if (report && displayAlert && invalids.length) {
        $.av.alertErrors( $.unique( invalids ), this );
      }

      //
      return !invalids.length;
    }

  });

})(jQuery);
