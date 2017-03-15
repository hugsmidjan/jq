/*! $.fn.autoValidate/.defangEnter/.defangReset  1.0  -- (c) 2009-2014 Hugsmiðjan ehf.  @preserve */
!function(e){e.fn.addBack=e.fn.addBack||e.fn.andSelf;var t="tmp_"+(new Date).getTime(),a=0,r={lang:"en",maxLabelLength:35,errorAction:"focus",focusElmClass:"stream",formInvalidClass:"is-invalid",submittedClass:"issubmitted",validateEachField:"",errorMsgType:"alertonly",inlineErrorClass:"errmsg",nextErrorLinkClass:"nexterror",customReqCheck:{},reqClassPattern:"req",reqErrorClass:"reqerror",typeErrorClass:"typeerror",defangReset:!0,defangEnter:"auto",consumeRequired:!0,consumeMinlength:!0};e.extend({av:{lang:{en:{bullet:" • ",errorReqMsg:"Please fill out these fields:\n\n",errorTypeMsg:"These fields contain invalid input:\n\n",inlineMsgPrefix:"Error:",inlineReqMsg:"This field is required ",inlineTypeMsg:"This field contains an invalid value ",inlineNextError:"Next error",resetAlert:"Note: You are about to reset all values in the form..."}},id:function(r){r=e(r);var n=r.attr("id");return n?n:r.attr("id",t+"_"+a++).attr("id")},cleanLabelString:function(e,t){return e?(t=t||35,e=e.replace(/\s\s+/g," ").replace(/ - /g,", ").replace(/\[/g,"(").replace(/\]/g,")").replace(/\([^)]+\)/g,"").replace(/[\s*:#]+$/,"").replace(/^[\s*#]+/,""),e.length>t+2&&(e=e.substr(0,t-2).replace(/[.,:;\s]+$/,"")+"..."),e):""},getLabel:function(t,a,r){var n=t.find(":input:first"),i=n.data("av-labeltext");if(!i){i=e.av.cleanLabelString(n.attr("title"),r.maxLabelLength);var s=n.attr("id");if(!i&&s){var o=n.closest("form").find("label[for="+s+"]").text()||n.parent("label").text()||t.find("label").eq(0).text();i=e.av.cleanLabelString(o,r.maxLabelLength)}var l=t.is("fieldset")&&t.find('input[name="'+n.attr("name")+'"]')[1];if(l){var c=t.find(":header,legend,p").eq(0).text()||t.attr("title");i=c?e.av.cleanLabelString(c,r.maxLabelLength):i}i||(i=n.attr("name"));var f=a.find("fieldset:has(#"+e.av.id(t)+"):last"),u=f.children(":header,legend,p").eq(0);u.length&&(i+=" ["+e.av.cleanLabelString(u.text()||f.attr("title"),r.maxLabelLength)+"]"),e(n).data("av-labeltext",i)}return i},getText:function(t,a){return e.av.getError(t,a)||e.av.getError(t,"en")||""},getError:function(t,a){return e.av.lang[a]&&e.av.lang[a][t]||""},config:function(t,a){var n=e(t),i=e(n.closest("form")[0]||n.find("form")[0]);return a?i.data("av-config",a):(a=i.data("av-config"),a||(a=e.extend({},r),i.data("av-config",a))),a},addInlineLabels:function(t){var a=e.av.config(t[0]);e.each(t,function(r){var n=e(this),i=n.closest("[lang]").attr("lang");n.attr("lang",i);var s=e.av.getText("inlineReqMsg",i);n.is("."+a.typeErrorClass)&&(s=n.data("av-error")||e.av.getText("inlineTypeMsg",i)),n.prepend('<strong class="'+a.inlineErrorClass+'">'+s+"</strong>"),r<t.length-1&&n.append('<a href="#'+e.av.id(t[r+1])+'" class="'+a.nextErrorLinkClass+'">'+e.av.getText("inlineNextError",i)+"</a>")})},alertErrors:function(t,a){var r=e.av.config(t[0]),n=e(t[0]).closest("[lang]").attr("lang");e(t[0]).attr("lang",n);var i=[],s=[],o="";e.each(t,function(){var t=e(this),n=e.av.getLabel(t,a,r),o=t.data("av-error-short");o&&(n+=" ("+o+")"),e(this).is("."+r.typeErrorClass)?s.push(n):i.push(n)});var l=e.av.getText("bullet",n);i.length&&(o+=e.av.getText("errorReqMsg",n)+l+i.join("\n"+l)),s.length&&(o+="\n\n",o+=e.av.getText("errorTypeMsg",n)+l+s.join("\n"+l)),alert(e.trim(o))},focusNext:function(t){var a=e(":input").get();a=a.sort(function(e,t){var a=e.tabIndex>0?e.tabIndex:99999,r=t.tabIndex>0?t.tabIndex:99999;return(a<r)*-1+1*(a>r)});for(var r=e.inArray(t,a);a[++r]&&a[r].tabIndex===-1;);var n=e(a[r]||a[0]);return setTimeout(function(){n.trigger("focus")},1),n}}});var n=function(e){return!!e},i=function(){var t=e(this),a=t.closest("form").find('input[name="'+t.attr("name")+'"]:checked');return!(!a[0]||a.is(":radio")&&!a.filter(function(){return!!e(this).val()})[0])};e.extend(e.av,{type:{fi_btn:function(){return!0},fi_txt:n,fi_sel:n,fi_bdy:n,fi_file:n,fi_chk:i,fi_rdo:i}}),function(e){e.fn.constrainNumberInput=function(e){e=e?e.charAt?{selector:e}:e:{};var t=e.selector,a=this;return e.arrows&&(t?a.on("keydown",t,n).on("focusin",t,i):a.on("keydown",n).on("focusin",i)),t?a.on("keypress",t,c(e.floats)).on("keyup",t,l):a.on("keypress",c(e.floats)).on("keyup",l),a};var t="cni_focused",a="cni_changed",r=function(t){var a=t.value;return a="object"==typeof e.prettyNum?e.prettyNum.read(a,e(t).closest("[lang]").attr("lang")||"en"):a,parseFloat(a)},n=function(n){var i=this,s=38===n.which?1:40===n.which?-1:0;if(i.autocomplete="off",s){s=s*(i.step||1)*(n.shiftKey?10:1);var l=r(i),c=o(i,(l||0)+s);if(l!==c){i.value=c;var f=e(i);f.data(t)?f.data(a,!0):f.trigger("change")}}},i=function(){var r=e(this);r.data(t,!0).off(".cni").one("change.cni",function(){r.removeData(t).removeData(a).off("focusout.cni")}).one("focusout.cni",function(){setTimeout(function(){r.data(t)&&r.data(a)&&r.removeData(t).trigger("change"),r.removeData(a)},100)})},s={44:1,45:1,46:1},o=function(e,t){var a,r,n=e.min&&!isNaN(a=parseFloat(e.min))&&t<a?a:e.max&&!isNaN(r=parseFloat(e.max))&&t>r?r:t;return n},l=function(){var t=this,a=t.value;if(a){a=r(t);var n=o(t,a||0);a!==n&&(t.value=n,e(t).trigger("keyup.outofbounds"))}},c=function(e){return function(t){t.ctrlKey||t.metaKey||!t.which||8===t.which||13===t.which||!(t.which<48||t.which>57)||e&&s[t.which]||t.preventDefault()}}}(jQuery),e.fn.extend({defangReset:function(){return this.on("click",function(){var t=e(this),a=t.closest("[lang]").attr("lang")||"en";return t.attr("lang",a),!!confirm(e.av.getText("resetAlert",a))&&("reset"!==t.attr("type")&&t.closest("form").trigger("reset"),!0)})},defangEnter:function(){return this.on("keydown",function(e){var t=e.target;return 13!==e.which||"INPUT"!==t.tagName||/^(button|reset|submit)$/i.test(t.type)})},autoValidate:function(t){return this.each(function(){var a=e(this),n=e(a.closest("form")[0]||a.find("form")[0]);if(!n.length)return!1;var i=e.extend({},r,t);e.av.config(this,i),i.defangReset&&n.find(":reset").defangReset(i),(!i.emulateTab&&i.defangEnter===!0||"true"===i.defangEnter||"auto"===i.defangEnter&&e(":submit",n).length>1)&&n.defangEnter(),i.emulateTab&&n.on("keydown",function(t){if(13===t.keyCode&&e(t.target).is(":input:not(:button):not(:reset):not(:submit):not(textarea)"))return e.av.focusNext(t.target),!1}),i.maxLengthTab&&n.on("keyup",function(t){var a=e(t.target),r=t.which;r>0&&8!==r&&9!==r&&13!==r&&16!==r&&17!==r&&a.attr("maxlength")===a.val().length&&e.av.focusNext(t.target)}),i.consumeRequired&&a.find("[required]").each(function(){var t=e(this).closest('[class^="fi_"], [class*=" fi_"]');t.length&&(t.addClass(i.reqClassPattern),e(this)[0].required=!1)}),i.consumeMinlength&&a.find("[minlength]").each(function(){var t=e(this).closest('[class^="fi_"], [class*=" fi_"]');t.length&&(e(this).attr("data-minlength",e(this).attr("minlength")),e(this).removeAttr("minlength"))}),"change"===i.validateEachField&&"inlineonly"===i.errorMsgType&&n.on("change",function(t){e(t.target).isValid()}),n.on("submit",function(t){var a=e(this);if(!a.data("av.skip")||a.data("av.disabled")){var r=e.av.config(this),n=a.isValid();return n?a.addClass(r.submittedClass):t.preventDefault(),n}a.removeData("av.skip")})})},isValid:function(t){t=!(!t&&null!=t);var a=[],r="",n=!1;this.each(function(){var i=e(this),s=[],o=!0,l=e.av.config(this);if(n=n||/both|alertonly/.test(l.errorMsgType),t){var c=i.is(":input")?i.parent():i;r=r||"strong."+l.inlineErrorClass+", a."+l.nextErrorLinkClass,c.find(r).remove()}var f=i.is(":input")?i:i.find(":input");f.not(l.includeDisabled?"":":disabled").not(':submit,:reset,:button,[type="hidden"]').each(function(){var a=e(this),r="checkbox"===this.type?{fi_chk:e.av.type.fi_chk}:"radio"===this.type?{fi_rdo:e.av.type.fi_rdo}:{fi_txt:e.av.type.fi_txt},n=a.closest('[class^="fi_"], [class*=" fi_"]'),i=n.closest("[lang]").attr("lang"),c=n.hasClass(l.reqClassPattern)||a.hasClass(l.reqClassPattern);if(t&&(n.removeClass(l.reqErrorClass),n.removeClass(l.typeErrorClass)),0!==n.length)for(var f,u=e.trim(n.attr("class")).split(/\s+/);f=u.pop();)/^fi_/.test(f)&&e.isFunction(e.av.type[f])&&(r[f]=e.av.type[f]);a.is("[data-minlength]")&&(r.minlength=e.av.type.minlength);var g=a.attr("name"),d=l.customReqCheck&&l.customReqCheck[g];if(d&&e.isFunction(d))c=d.call(this,e.trim(a.val()),n.get(0)||this,i);else if(d&&"string"==typeof d){var h=/^(!)?(.*)$/.exec(d),v=e(':input[name="'+h[2]+'"]',this.form);v.length&&(c=v.is(":checkbox, :radio")?!h[1]^!v.filter(":checked").length:!h[1]^""===v.val())}l.customTypeCheck&&e.isFunction(l.customTypeCheck[g])&&(r[g]=l.customTypeCheck[g]);for(var p in r){n.attr("lang",i);var m=r[p].call(this,e.trim(a.val()),n.get(0)||this,i);if(m!==!0){o=!1;var y="string"==typeof m;if(m||y){if(s.push(n.get(0)),t){var b;y||(b=m.alert,m=m.inline),n.data("av-error",m),n.data("av-error-short","string"==typeof b?b:m),n.removeClass(l.reqErrorClass),n.addClass(l.typeErrorClass)}}else c&&(s.push(n.get(0)),t&&n.addClass(l.reqErrorClass))}}}),t&&/both|inlineonly/.test(l.errorMsgType)&&e.av.addInlineLabels(e.unique(s)),a=a.concat(s)});var i=!a.length;if(t){if(!i){var s=e(a[0]).find("*").addBack().filter("input, select, textarea");s.focusHere?s.focusHere():s.setFocus?s.focusHere():s[0].focus(),n&&e.av.alertErrors(e.unique(a),this)}var o=e(a).closest("form"),l=o.data("av-config")||{};o.toggleClass(l.formInvalidClass||"",!i).trigger({type:"autovalidated",isValid:i,invalids:e(a)})}return i}})}(jQuery);
jQuery.av.lang.is={bullet:" • ",errorReqMsg:"Það þarf að fylla út þessa liði:\n\n",errorTypeMsg:"Þessir liðir eru rangt útfylltir:\n\n",inlineMsgPrefix:"Villa:",inlineReqMsg:"Það þarf að fylla út þennan lið ",inlineTypeMsg:"Þessi liður er rangt út fylltur ",inlineNextError:"Næsta villa",resetAlert:"Ath: Þú ert í þann mund að afturkalla öll innslegin gildi...",fi_kt_fyrirt:"Sláðu inn fyrirtækiskennitölu",fi_kt_einst:"Sláðu inn kennitölu einstaklings",fi_email:{inline:"Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)",alert:"e.g. nafn@domain.is"},fi_url:{inline:"Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)",alert:"e.g. http://www.domain.is"},fi_year:{inline:"Vinsamlega sláðu inn rétt ártal (dæmi: 1998)",alert:"t.d. 1998"},fi_ccnum_noamex:"American Express kort virka ekki",fi_valuemismatch:"Staðfesting stemmir ekki",minlength:"Lágmarks stafafjöldi: "};
!function(e){e.extend(e.av.lang.en,{fi_kt_fyrirt:"Only company 'kennitala's allowed",fi_kt_einst:"Only people's 'kennitala's allowed",fi_email:{inline:"Please provide a valid e-mail address (example: user@example.com)",alert:"e.g. user@example.com"},fi_url:{inline:"Please provide a valid web address (example: http://www.example.is)",alert:"e.g. http://www.example.com"},fi_year:{inline:"Please provide a valid four digit year (example: 1998)",alert:"e.g. 1998"},fi_valuemismatch:"Confirmation doesn't match",minlength:"Minimum characters: "});var t=e.av.type;e.extend(t,{fi_kt:function(t,r,i){if(t){var a=e.av.getError("fi_kt",i),n=t.replace(/[\s\-]/g,"");e(this).val(n);var s=/010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(n);if(s||!/^\d{9}[90]$/.test(n))return a;for(var f=[3,2,7,6,5,4,3,2,1],l=0,u=9;u--;)l+=f[u]*n.charAt(u);if(l%11)return a}return!!t},fi_kt_einst:function(r,i,a){var n=t.fi_kt.call(this,r,i,a);return n===!0&&(r=e(this).val(),parseInt(r.substr(0,1),10)>3&&(n=e.av.getError("fi_kt_einst",a))),n},fi_kt_fyrirt:function(r,i,a){var n=t.fi_kt.call(this,r,i,a);return n===!0&&(n="string"==typeof t.fi_kt_einst.call(this,r,i,a),n||(n=e.av.getError("fi_kt_fyrirt",a))),n},fi_email:function(t,r,i){return t&&!/^[a-z0-9\-._+]+@(?:[a-z0-9\-_]+\.)+[a-z0-9\-_]{2,99}$/i.test(t)?e.av.getError("fi_email",i):!!t},fi_url:function(t,r,i){return!!t&&(/^www\./.test(t)&&(t="http://"+t,e(this).val(t)),!(!/^[a-z]+:\/\/.+\..+$/.test(t)||/[\(\)<\>\,\"\[\]\\\s]/.test(t))||e.av.getError("fi_url",i))},fi_tel:function(e,t){if(e){var r=t.className.match(/(?:^| )fi_tel_min_(\d+)(?: |$)/);return!e.replace(/(?:\s|[\-+()]|\d)/g,"")&&(!r||r[1]<=e.replace(/\D/g,"").length)||""}return!1},fi_tel_is:function(e){return!!e&&(/^(?:\+354)?\d{7}$/.test(e.replace(/[ -()]/g,""))||"")},fi_postal_is:function(t,r,i){if(t){var a=e.av.postCodes&&e.av.postCodes.is;if(!a)return/^\d\d\d$/.test(t)||e.av.getError("fi_pnr",i);if(a[t]){if(this.nodeType){var n=e(this).siblings("span.unit");n.length||(n=e('<span class="unit"></span>'),e(this).after(n)),n.html(a[t])}return!0}return e.av.getError("fi_pnr",i)}return!1},fi_pnrs:function(t,r,i){if(t){for(var a=t.replace(/(^[ ,;]+|[ ,;]+$)/g,"").split(/[ ,;]+/),n=0;n<a.length;n++)if(t=e.av.type.fi_postal_is(a[n],null,i),t!==!0)return t;return!0}return!1},fi_qty:function(t){return e(this).val(t),!t||/^\d+$/.test(t)||""},fi_num:function(t){return t=t.replace(/^-\s+/,"-").replace(/[,.]$/,""),e(this).val(t),!t||/\d/.test(t)&&/^-?\d*[.,]?\d*$/.test(t)||""},fi_year:function(t,r,i){return t&&!/^(19|20)\d\d$/.test(t)?e.av.getError("fi_year",i):!!t},fi_date:function(t,r,i){if(t){var a=e.av.getError("fi_year",i),n=window.datePicker;if(n&&n.VERSION<2){var s=e.av.id(this),f=n.fields[s];if(f){var l=n.parseDate(s);if(l){var u=n.printDateValue(l,f.dateFormat,i).replace(/(^\s+|\s+$)/g,"");return f.caseSensitive||(t=t.toLowerCase(),u=u.toLowerCase()),u===t||n.printDateValue(new Date(2e3,4,27),f.dateFormat,i)}return a}}return t=t.replace(/[ .\-\/]+/g,".").replace(/\.(\d\d)$/,".20$1"),/^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/.test(t)||a}return!!t},fi_time:function(t,r,i){if(t){var a=e.av.getError("fi_time",i);if(/^([01]?\d|2[01234])(?:[:.]([0-5]\d))?(?:[:.]([0-5]\d))?\s*([ap]\.?m\.?)?$/i.test(t)){var n=RegExp.$1,s=RegExp.$2||"00",f=RegExp.$3,l=(RegExp.$4+"").replace(/\./g,"").toLowerCase();"pm"===l&&(n=1*n+12);var u=60*n*60+60*s+60*(f||0)<=86400;return u&&e(this).val(n+":"+s+(f?":"+f:"")+l),u||a}return a}return!!t},fi_ccnum:function(t,r,i){var a=e.av.getError("fi_ccnum",i);if(t){var n=t.replace(/[ \-]/g,"");if(!/^\d{13,19}$/.test(n))return a;e(this).val(n);for(var s=0,f=!1,l=n.length;l--;){var u=1*n.charAt(l);f&&(u+=u-(u>4?9:0)),f=!f,s+=u}var o=s%10===0;return o||a}return!!t},fi_ccexp:function(t,r,i){return t?(t=t.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/,"$1/$2").replace(/\s+/g,""),/^(0\d|1[012])\/(\d\d)$/.test(t)||e.av.getError("fi_ccexp",i)):!!t},fi_sameasprev:function(t,r,i){if(t=e(this).val()){var a=e(this.form).find(".fi_txt>input,select,textarea"),n=a.index(this),s=n>0?a.eq(n-1).val():"";if(s&&t!==s)return e.av.getError("fi_valuemismatch",i)}return!!t},minlength:function(t,r,i){var a=parseInt(e(r).find("[data-minlength]").attr("data-minlength"),10);return t&&t.length<a?e.av.getError("minlength",i)+a:!!t}}),t.fi_pnr=t.fi_postal_is}(window.jQuery);
