// encoding: utf-8
//
// jquery.av.core.js
// jquery.av.lang.is.js
// jquery.av.extratypes.js

(function($){

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

    defangReset         : true,              // assign a confirmation dialog to reset buttons to prevent accidental resets
    defangEnter         : 'auto',            // disable form submitions on enter key.
                                             // Values are (true|false|auto) where:
                                             //  true  - disables all enter submits,
                                             //  false - doesn't alter bowser defaults,
                                             //  auto  - disables enter submitions if form has a POST method or >1 submit button
    emulateTab          : false,
    maxLengthTab        : false

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
        return (id) ? id : jq.attr('id', idPrefix + '_' + (idSuffix++)).attr('id')
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
            //   input.parents('form').find('label[for={id}]')
            //   input.parent('label')
            //   control.find('label').eq(0)
            var l = input.parents('form').find('label[for='+id+']').text() ||
                    input.parent('label').text() ||
                    control.find('label').eq(0).text();

            labelData = $.av.cleanLabelString( l, conf.maxLabelLength );
          }

          // if this element is a group (has named 1+ siblings contained in fieldset wrapper)
          // the groups heading will override the current label text
          var isGroup = control.is('fieldset:has(input[name=' + input.attr('name') + ']:eq(1))');
          if (isGroup) {
            var thd = control.find(':header, legend, p').eq(0).text();  // move to config?
            labelData = (thd) ? $.av.cleanLabelString( thd, conf.maxLabelLength ) : labelData;
          }

          // still no label data? -- control must not have any label or title... fall back to name attribute
          if (!labelData) {
            labelData = input.attr('name');
          }

          // form elements that are contained by fieldset that has a heading
          // additionally get their fieldsets legend/heading in []
          var legend = contexts.find('fieldset:has(#'+$.av.id(control)+'):last')
                               .children(':header:first-child, legend:first-child, p:first-child');
          if (legend.length) {
            labelData = labelData + ' [' + $.av.cleanLabelString( legend.text(), conf.maxLabelLength ) + ']';
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

        var context = $( ctx );
        var form    = context.is('form') ? context : $( context.attr('form') || context.parent('form').get(0) );

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
          var lang = ctrl.attr('lang') || ctrl.parents('[lang]').attr('lang');

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
        var lang = $( ctrllist[0] ).attr('lang') || $( ctrllist[0] ).parents('[lang]').attr('lang');
        $( ctrllist[0] ).attr( 'lang', lang );

        var missing   = [];
        var malformed = [];
        var msg       = '';

        // sort through invalid inputs and build error messages
        $.each(ctrllist, function(i){

          var ctrl  = $( this );
          var label = $.av.getLabel( ctrl, contexts, conf );

          if ($(this).is('.' + conf.typeErrorClass)) {  // is it a type error?
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
        while (elms[++n] && elms[n].tabIndex == -1) {}
        // loop to first one if we have no target
        var felm = $( elms[n] || elms[0] );
        setTimeout(function () {
          felm.focus();
        },1);
        return felm;
      }

    }

  });

  // space for types
  $.extend( $.av, {
    type : {
      'fi_btn' : function ( v, w ) {
        return true; // prevents nonsense requirements
      },
      'fi_txt' : function ( v, w ) {
        return v !== '';
      },
      'fi_sel' : function ( v, w ) {
        return v !== '';
      },
      'fi_chk' : function ( v, w ) {
        var inp = $(this);
        return inp.parents('form').find('[name=' + inp.attr('name') + ']').is(':checked');
      },
      'fi_rdo' : function ( v, w ) {
        var inp = $(this);
        return inp.parents('form').find('[name=' + inp.attr('name') + ']').is(':checked');
      },
      'fi_bdy' : function ( v, w ) {
        return v !== '';
      },
      'fi_file' : function ( v, w ) {
        return v !== '';
      }
    }
  });


  // jq functions
  $.fn.extend({

    // defangReset can may be run against any collection of elements to defang
    // them OR, in case of non reset buttons, turn them into reset buttons.
    defangReset : function () {
      return this.each(function(){
        $( this ).click(function(e){
          var btn = $( this );
          var lang = btn.attr('lang') || btn.parents('[lang]').attr('lang') || 'en';
          btn.attr( 'lang', lang );
          if ( confirm($.av.getText( 'resetAlert', lang )) ) {
            // call a reset function if this isn't an actual reset button
            if (btn.attr('type') !== "reset") {
              var form = btn.parents('form').get(0);
              if (form) { form.reset(); }
            }
            return true;  // accept the click
          }
          return false;  // cancel the click by default
        })
      });
    },

    defangEnter : function () {
      return this.each(function(){
        $( this ).keydown(function(e){
          var target = e.target;
          if ( e.keyCode == 13 &&
                target.tagName === 'INPUT' &&
                /^(button|reset|submit)$/i.test(target.type) ) { // this happens every ENTER keypress!
            return false
          }
          return true;
        })
      });
      return this;
    },

    autoValidate : function ( config ) {

      // TODO : validateEachField is missing

      return this.each(function(){

        var context = $( this );
        var form = context.is('form') ? context : $( this.form || context.parent('form').get(0) );

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
             (conf.defangEnter === 'auto' &&
               form.attr('method') == 'post' ||   // form uses post method
               form.is(':has(:submit:eq(1))')     // form has more than one submit button?
            )) {
          form.defangEnter();
        }

        // turn the enter key into tab for all inputs except textareas, and buttons
        if (conf.emulateTab) {
          form.keydown(function(e){
            if (e.keyCode == 13 &&
                $(e.target).is(':input:not(:button):not(:reset):not(:submit):not(textarea)')) {
              $.av.focusNext( e.target );
              return false;
            }
          });
        }

        // functionality to tab to the next field when maxlength is reached
        if (conf.maxLengthTab) {
          form.keyup(function(e){
            var t = $(e.target);
            var w = e.which;
            // only trigger with keycodes (not scancodes), and where keycode isn't backspace,tab,enter,
            if ( (w > 0 && w != 8 && w != 9 && w != 13 && w != 16 && w != 17) &&
                 t.attr('maxlength') == t.val().length ) {
              $.av.focusNext( e.target );
            }
          });
          // TODO: consider adding the reverse for backspace
        }


        if (/blur|change/.test(conf.validateEachField)) {
          // $( this ).isValid();
          // what context should the validation be called on?
        }
        form.submit(function(e){

          var f = $( this );
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
            validContext = true;

        conf = $.av.config( this );

        displayAlert = displayAlert || /both|alertonly/.test( conf.errorMsgType );

        // purge wrapper of old error notifications
        errMsgSel = errMsgSel || 'strong.' + conf.inlineErrorClass + ', a.' + conf.nextErrorLinkClass;
        context.find( errMsgSel ).remove();

        // find controls that need validation
        var controls = !context.is(':input') ? context.find(':input') : context;

        controls.each(function(){

          var control = $( this );
          control.removeData( 'av-malformed' );

          // get this control's types (defaulting to fi_txt for everything except checkboxes)
          var tests = (this.type == 'checkbox')
                  ? { 'fi_chk' : $.av.type['fi_chk'] }
                  : { 'fi_txt' : $.av.type['fi_txt'] },

              wrap =      control.parents( '[class^="fi_"], [class*=" fi_"]' ),

              lang =      wrap.attr( 'lang' ) || wrap.parents( '[lang]' ).attr( 'lang' ),
              required =  wrap.hasClass( conf.reqClassPattern ) || control.hasClass( conf.reqClassPattern ),
              value =     $.trim( control.val() );

          // purge wrapper of old error notifications
          wrap.removeClass( conf.reqErrorClass );
          wrap.removeClass( conf.typeErrorClass );

          if (wrap.length !== 0) {
            var c, cls = $.trim( wrap.attr('class') ).split(' ');
            while (c = cls.pop()) {
              if (/^fi_/.test(c) && $.isFunction( $.av.type[c] )) {
                tests[c] = $.av.type[c];
              }
            }
          }

          // extra requirement check
          var name = control.attr('name'),
              reqchk = conf.customReqCheck && conf.customReqCheck[name];
          if (reqchk && $.isFunction( reqchk )) {
            required = reqchk.call( this, value, wrap.get(0) || this, lang );
          }
          else if (reqchk && typeof(reqchk) === 'string') {
            var m = /^(!)?(.*)$/.exec(reqchk);
            var t = $(':input[name=' + m[2] + ']', this.form);  // use context rather than form?
            if (t.length && ('checkbox' == t.attr('type') || 'radio' == t.attr('type'))) {
              required = !m[1] ^ !t.is(':checked');
            }
            else if (t.length) {
              required = !m[1] ^ (t.val() == '');
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
            var res = tests[v].call( this, value, wrap.get(0)||this, lang );

            // react to invalid control
            if ( res !== true ) {

              validContext = false;

              // context.is('fieldset:has(input[name=' + input.attr('name') + ']:gt(1))');
              //var id = $.av.id( this );

              // returned value was: a string (error message / exception)
              if ( typeof(res) === 'string' ) {

                // string should detail how to complete the field
                contextInvalids.push( wrap.get(0) );
                wrap.data( 'av-error', res );

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
      if (report && displayAlert && invalids.length) {
        $.av.alertErrors( $.unique( invalids ), this );
      }

      //
      return !invalids.length;
    }

  });

})(jQuery);


// Icelandic translation
jQuery.av.lang.is = {

  bullet          : ' • ',
  errorReqMsg     : 'Það þarf að fylla út þessa liði:\n\n',
  errorTypeMsg    : 'Þessir liðir eru rangt útfylltir:\n\n',
  inlineMsgPrefix : 'Villa:',
  inlineReqMsg    : 'Það þarf að fylla út þennan lið ',
  inlineTypeMsg   : 'Þessi liður er rangt út fylltur ',
  inlineNextError : 'Næsta villa',
  resetAlert      : 'Ath: Þú ert í þann mund að afturkalla öll innslegin gildi...',

  fi_email        : 'Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)',
  fi_url          : 'Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)',
  fi_year         : 'Vinsamlega sláðu inn rétt ártal (dæmi: 1998)'

};


(function($){

$.extend($.av.lang.en, {

  fi_email : 'Please provide a valid e-mail address (example: user@example.com)',
  fi_url   : 'Please provide a valid web address (example: http://www.example.is)',
  fi_year  : 'Please provide a valid four digit year (example: 1998)'

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

$.extend($.av.type, {
  

  fi_kt : function ( v, w, lang ) {
    var error = $.av.getError( 'fi_kt', lang );
    if (v) {
      var kt = v.replace(/[\s\-]/g, ''); // Allow "-" and " " as delimiting characters (strip them out).
      $( this ).val( kt );
      // remainder must all be numericals, 10 characters, and the last character must be 0 or 9 
      // kt must not be a robot
      var robot = /010130[- ]?(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(kt);
      if ( !/^\d{9}[90]$/.test(kt) || robot) { 
        return error;
      }
      // Checksum validation
      var x = [3,2,7,6,5,4,3,2,1], 
          _summa = 0,
          i = 9;
      while (i--) { _summa += (x[i] * kt.charAt(i)); }
      if (_summa % 11) {
        return error;
      }

    }
    return (v != '');
  },


  // ====[ internet & communication ]====

  fi_email : function ( v, w, lang ) {
    if (v && !/^[a-z0-9-._+]+@([a-z0-9-_]+\.)+[a-z0-9-_]{2,99}$/i.test(v)) {
      return $.av.getError( 'fi_email', lang );
    }
    return (v != '');
  },
  
  fi_url : function( v, w, lang ) {
    if (v) { 
      var _url = v.replace(/^[a-z]+:\/\/.+$/i, '');
      if ( !/^[a-z]+:\/\/.+\..+$/.test( v ) || 
           /[\(\)\<\>\,\:\"\[\]\\]/.test( _url ) ) {
        return $.av.getError( 'fi_url', lang );
      }
      return true;
    }
    return false;
  },

  // Returns true if valid telephone number (further development needed)
  fi_tel : function( v, w, lang ) {
    if (v) {
      // This function simply removes all *legal* characters from the string
      // and then returns false if there are any left overs afterwards.
      return !v.replace( /(\s|[-+]|\d)/g, '' ) || '';
    }
    return false;
  },


  // Returns true on a valid Icelandic Zip-code ("póstnúmer").
//    is : "dæmi: 101",
//    en : "example: 101",
  fi_postal_is : function ( v, w, lang ) {
    
    if (v) {
      // have no DB -- fallback to a simple 3-digits test
      var codes = $.av.postCodes && $.av.postCodes.is;
      if (!codes) { 
        return /^\d\d\d$/.test( v ) || $.av.getError( 'fi_pnr', lang );
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
    is : "dæmi: 101, 107, 105",
    en : "example: 101, 107, 105",
    delimiter : ", ",
*/
  fi_pnrs : function ( v, w, lang ) {
    if ( v ) {
      var pnrs = v.replace(/(^[ ,;]+|[ ,;]+$)/g,'').split(/[ ,;]+/);
      var v, valid = false;
      for (var i=0; i < pnrs.length; i++) {
        v = $.av.type['fi_postal_is']( pnrs[i], null, lang );
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
  fi_qty : function( v, w, lang ) {
    $( this ).val( v );  // set field to trimmed value
    return !v || /^\d+$/.test(v) || '';
  },

  // Returns true only on any numeric value (floats, negative values, etc.).
  fi_num : function( v, w, lang ) {
    var v = v.replace(/^-\s+/, '-').replace(/[,.]$/, '');
    $( this ).val( v );
    return !v || (/\d/.test(v) && /^-?\d*[.,]?\d*$/.test(v)) || '';
  },




  // ====[ dates ]====

  // Returns true on a valid date (dd.mm.yyyy|d/m/yy|etc.). 
  // Valid year-range: 1900-2099. one or two digit days and months, two or four digit years.
  fi_year : function ( v, w, lang ) {
    if (v && !/^(19|20)\d\d$/.test(v)) {
      return $.av.getError( 'fi_year', lang );
    }
    return (v != '');
  },
  
  // Returns true on a valid date (dd.mm.yyyy|d/m/yy|etc.). 
  // Valid year-range: 1900-2099. one or two digit days and months, two or four digit years
  //    is : "dæmi: %format",
  //    en : "example: %format",
  fi_date : function ( v, w, lang ) {
    if (v)
    {
      var error = $.av.getError( 'fi_year', lang );

      // has datepicker
      if (window.datePicker && datePicker.VERSION < 2) {
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
            return (_dateStr == v) || datePicker.printDateValue(new Date(2000,4,27), _dateUI.dateFormat, lang);
          }
        }
      }

      // we can get to here if: we have no datepicker, we have datepicker but no config for this field
      v = v.replace(/[ .-\/]+/g, '.').replace(/\.(\d\d)$/, '.20$1');
      // $(this).val( v );
      return /^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/.test(v) || error;
      
    }
    return (v != '');
  },


  // validate a correct time entry
  fi_time : function ( v, w, lang ) {
    if (v) {
      var error = $.av.getError( 'fi_time', lang );
      if ( /^([01]?\d|2[01234])(:([0-5]\d))?(:([0-5]\d))?\s*([ap]\.?m\.?)?$/i.test( v ) ) {
        var h = parseInt( RegExp.$1, 10 ),
            m = parseInt( RegExp.$3 || '0', 10 ),
            s = parseInt( RegExp.$5 || '0', 10 ),
            t = (RegExp.$6 + '').replace('.', '').toLowerCase();
        if (t == 'pm') { h += 12; }
        var time = (h * 60 * 60) + (m * 60) + (s * 60);
        return (time <= 86400) || error;
      }
      else {
        return error;
      }
    }
    return (v != '');
  },
  

  // ====[ credit cards ]====


  // Returns true if valid credid card number
  fi_ccnum : function ( v, w, lang ) {
    var error = $.av.getError( 'fi_ccnum', lang );
    if (v) {
      // Strip out the optional space|dash delimiters
      var ccNum = v.replace(/[ -]/g, ''); 
      if (
            !/^(\d{16}|3[47]\d{13})$/.test( ccNum )                                   // make sure there are 16 digits (or 15 for AmEx cards (starting with 34 or 37))
            || (ccNum.length == 15 && $(w).hasClass(arguments.callee.noAmExClass) ) // and the field-container doesn't explicitly forbid AmEx cards...
          ) {
        return error;
      }

      // insert the cleaned up creditcard number back into the field
      // $( this ).val( ccNum ); 
      var checkSum = 0,
          item,
           i = ccNum.length;
      while (i-->0) // warning for 15 digit numbers i may sink below zero
      {
        checkSum += ccNum.charAt(i--) * 1;
        item = ccNum.charAt(i) * 2;
        checkSum += Math.floor(item/10) + (item%10); // ?versumma!
      }
      return !(checkSum % 10) || error;  // checkSum % 10 must be 0
    }
    return (v != '');
  },

  // Returns true if valid credid card expiry date (further development needed to check against the current year)
  fi_ccexp : function ( v, w, lang ) { 
    if (v) {
      // accept space and dash, and change them into "/". Then remove all spaces
      v = v.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/, '$1/$2').replace(/\s+/g, ''); 
      // ...then test against the pattern "mm/yy"
      return /^(0\d|1[012])\/(\d\d)$/.test(v) || $.av.getError( 'fi_ccexp', lang ); 
    }
    return (v != '');
  }
  

});


$.av.type.fi_ccnum.noAmExClass = 'no-amex';


})(jQuery);

