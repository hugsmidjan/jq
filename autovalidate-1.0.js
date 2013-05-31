// $.fn.autoValidate/.defangEnter/.defangReset  1.0  -- (c) 2009-2013 Hugsmiðjan ehf.
!function(e){e.fn.addBack=e.fn.addBack||e.fn.andSelf;var t="tmp_"+(new Date).getTime();var r=0;var a={lang:"en",maxLabelLength:35,errorAction:"focus",focusElmClass:"stream",submittedClass:"issubmitted",validateEachField:"",errorMsgType:"alertonly",inlineErrorClass:"errmsg",nextErrorLinkClass:"nexterror",customReqCheck:{},reqClassPattern:"req",reqErrorClass:"reqerror",typeErrorClass:"typeerror",defangReset:true,defangEnter:"auto"};e.extend({av:{lang:{en:{bullet:" • ",errorReqMsg:"Please fill out these fields:\n\n",errorTypeMsg:"These fields contain invalid input:\n\n",inlineMsgPrefix:"Error:",inlineReqMsg:"This field is required ",inlineTypeMsg:"This field contains an invalid value ",inlineNextError:"Next error",resetAlert:"Note: You are about to reset all values in the form..."}},id:function(a){a=e(a);var n=a.attr("id");return n?n:a.attr("id",t+"_"+r++).attr("id")},cleanLabelString:function(e,t){if(!e){return""}t=t||35;e=e.replace(/\s\s+/g," ").replace(/ - /g,", ").replace(/\[/g,"(").replace(/\]/g,")").replace(/\([^)]+\)/g,"").replace(/[\s*:#]+$/,"").replace(/^[\s*#]+/,"");if(e.length>t+2){e=e.substr(0,t-2).replace(/[.,:;\s]+$/,"")+"..."}return e},getLabel:function(t,r,a){var n=t.find(":input:first");var i=n.data("av-labeltext");if(!i){i=e.av.cleanLabelString(n.attr("title"),a.maxLabelLength);var s=n.attr("id");if(!i&&s){var l=n.closest("form").find("label[for="+s+"]").text()||n.parent("label").text()||t.find("label").eq(0).text();i=e.av.cleanLabelString(l,a.maxLabelLength)}var o=t.is("fieldset")&&t.find("input[name="+n.attr("name")+"]")[1];if(o){var f=t.find(":header,legend,p").eq(0).text()||t.attr("title");i=f?e.av.cleanLabelString(f,a.maxLabelLength):i}if(!i){i=n.attr("name")}var c=r.find("fieldset:has(#"+e.av.id(t)+"):last"),u=c.children(":header,legend,p").eq(0);if(u.length){i+=" ["+e.av.cleanLabelString(u.text()||c.attr("title"),a.maxLabelLength)+"]"}e(n).data("av-labeltext",i)}return i},getText:function(t,r){return e.av.getError(t,r)||e.av.getError(t,"en")||""},getError:function(t,r){return e.av.lang[r]&&e.av.lang[r][t]||""},config:function(t,r){var n=e(t),i=e(n.closest("form")[0]||n.find("form")[0]);if(r){i.data("av-config",r)}else{r=i.data("av-config");if(!r){r=e.extend({},a);i.data("av-config",r)}}return r},addInlineLabels:function(t){var r=e.av.config(t[0]);e.each(t,function(a){var n=e(this);var i=n.closest("[lang]").attr("lang");n.attr("lang",i);var s=e.av.getText("inlineReqMsg",i);if(n.is("."+r.typeErrorClass)){s=n.data("av-error")||e.av.getText("inlineTypeMsg",i)}n.prepend('<strong class="'+r.inlineErrorClass+'">'+s+"</strong>");if(a<t.length-1){n.append('<a href="#'+e.av.id(t[a+1])+'" class="'+r.nextErrorLinkClass+'">'+e.av.getText("inlineNextError",i)+"</a>")}})},alertErrors:function(t,r){var a=e.av.config(t[0]);var n=e(t[0]).closest("[lang]").attr("lang");e(t[0]).attr("lang",n);var i=[];var s=[];var l="";e.each(t,function(){var t=e(this),n=e.av.getLabel(t,r,a),l=t.data("av-error-short");if(l){n+=" ("+l+")"}if(e(this).is("."+a.typeErrorClass)){s.push(n)}else{i.push(n)}});var o=e.av.getText("bullet",n);if(i.length){l+=e.av.getText("errorReqMsg",n)+o+i.join("\n"+o)}if(s.length){l+="\n\n";l+=e.av.getText("errorTypeMsg",n)+o+s.join("\n"+o)}alert(e.trim(l))},focusNext:function(t){var r=e(":input").get();r=r.sort(function(e,t){var r=e.tabIndex>0?e.tabIndex:99999;var a=t.tabIndex>0?t.tabIndex:99999;return(r<a)*-1+(r>a)*1});var a=e.inArray(t,r);while(r[++a]&&r[a].tabIndex===-1){""}var n=e(r[a]||r[0]);setTimeout(function(){n.trigger("focus")},1);return n}}});var n=function(e){return!!e},i=function(){var t=e(this),r=t.closest("form").find("input[name="+t.attr("name")+"]:checked");return!!r[0]&&(!r.is(":radio")||!!r.filter(function(){return!!e(this).val()})[0])};e.extend(e.av,{type:{fi_btn:function(){return true},fi_txt:n,fi_sel:n,fi_bdy:n,fi_file:n,fi_chk:i,fi_rdo:i}});!function(e){e.fn.constrainNumberInput=function(e){e=!e?{}:e.charAt?{selector:e}:e;var a=e.selector,n=this;if(e.arrows){a?n.on("keydown",a,t):n.on("keydown",t)}a?n.on("keypress",a,r):n.on("keypress",r);return n};var t=function(t){var r=this,a=t.which===38?1:t.which===40?-1:0;if(a){a=a*(r.step||1)*(t.shiftKey?10:1);var n,i,s=(parseInt(e.trim(r.value),10)||0)+a;s=a<0&&r.min&&!isNaN(n=parseInt(r.min,10))?Math.max(s,n):a>0&&r.max&&!isNaN(i=parseInt(r.max,10))?Math.min(s,i):s;r.value=s;e(r).one("blur",function(){e(this).trigger("change")})}},r=function(e){if(!e.ctrlKey&&!e.metaKey&&e.which&&e.which!==8&&e.which!==13&&(e.which<48||e.which>57)){e.preventDefault()}}}(jQuery);e.fn.extend({defangReset:function(){return this.bind("click",function(){var t=e(this);var r=t.closest("[lang]").attr("lang")||"en";t.attr("lang",r);if(confirm(e.av.getText("resetAlert",r))){if(t.attr("type")!=="reset"){t.closest("form").trigger("reset")}return true}return false})},defangEnter:function(){return this.bind("keydown",function(e){var t=e.target;return e.which!==13||t.tagName!=="INPUT"||/^(button|reset|submit)$/i.test(t.type)})},autoValidate:function(t){return this.each(function(){var r=e(this),n=e(r.closest("form")[0]||r.find("form")[0]);if(!n.length){return false}var i=e.extend({},a,t);e.av.config(this,i);if(i.defangReset){n.find(":reset").defangReset(i)}if(!i.emulateTab&&i.defangEnter===true||i.defangEnter==="true"||i.defangEnter==="auto"&&e(":submit",n).length>1){n.defangEnter()}if(i.emulateTab){n.bind("keydown",function(t){if(t.keyCode===13&&e(t.target).is(":input:not(:button):not(:reset):not(:submit):not(textarea)")){e.av.focusNext(t.target);return false}})}if(i.maxLengthTab){n.bind("keyup",function(t){var r=e(t.target);var a=t.which;if(a>0&&a!==8&&a!==9&&a!==13&&a!==16&&a!==17&&r.attr("maxlength")===r.val().length){e.av.focusNext(t.target)}})}n.bind("submit",function(t){var r=e(this);if(!r.data("av.skip")||r.data("av.disabled")){var a=e.av.config(this);var n=r.isValid();if(n){r.addClass(a.submittedClass)}else{t.preventDefault()}return n}r.removeData("av.skip")})})},isValid:function(t){t=!!(t||t==null);var r=[],a="",n=false;this.each(function(){var i=e(this),s=[],l=true,o=e.av.config(this);n=n||/both|alertonly/.test(o.errorMsgType);a=a||"strong."+o.inlineErrorClass+", a."+o.nextErrorLinkClass;i.find(a).remove();var f=i.is(":input")?i:i.find(":input");f.not(o.includeDisabled?"":":disabled").not(":submit,:reset,:button").each(function(){var t=e(this);t.removeData("av-malformed");var r=this.type==="checkbox"?{fi_chk:e.av.type.fi_chk}:this.type==="radio"?{fi_rdo:e.av.type.fi_rdo}:{fi_txt:e.av.type.fi_txt},a=t.closest('[class^="fi_"], [class*=" fi_"]'),n=a.closest("[lang]").attr("lang"),i=a.hasClass(o.reqClassPattern)||t.hasClass(o.reqClassPattern);a.removeClass(o.reqErrorClass);a.removeClass(o.typeErrorClass);if(a.length!==0){var f,c=e.trim(a.attr("class")).split(/\s+/);while(f=c.pop()){if(/^fi_/.test(f)&&e.isFunction(e.av.type[f])){r[f]=e.av.type[f]}}}var u=t.attr("name"),v=o.customReqCheck&&o.customReqCheck[u];if(v&&e.isFunction(v)){i=v.call(this,e.trim(t.val()),a.get(0)||this,n)}else if(v&&typeof v==="string"){var g=/^(!)?(.*)$/.exec(v);var d=e(":input[name="+g[2]+"]",this.form);if(d.length){i=d.is(":checkbox, :radio")?!g[1]^!d.filter(":checked").length:!g[1]^d.val()===""}}if(o.customTypeCheck&&e.isFunction(o.customTypeCheck[u])){r[u]=o.customTypeCheck[u]}for(var h in r){a.attr("lang",n);var p=r[h].call(this,e.trim(t.val()),a.get(0)||this,n);if(p!==true){l=false;var m=typeof p==="string";if(p||m){var b;if(!m){b=p.alert;p=p.inline}s.push(a.get(0));a.data("av-error",p);a.data("av-error-short",typeof b==="string"?b:p);a.removeClass(o.reqErrorClass);a.addClass(o.typeErrorClass)}else if(i){s.push(a.get(0));a.addClass(o.reqErrorClass)}}}});if(t&&/both|inlineonly/.test(o.errorMsgType)){e.av.addInlineLabels(e.unique(s))}r=r.concat(s)});if(r.length){var i=e(r[0]).find("*").addBack().filter("input, select, textarea");i.focusHere?i.focusHere():i.setFocus?i.focusHere():i[0].focus()}if(t&&n&&r.length){e.av.alertErrors(e.unique(r),this)}return!r.length}})}(jQuery);
jQuery.av.lang.is={bullet:' • ',errorReqMsg:'Það þarf að fylla út þessa liði:\n\n',errorTypeMsg:'Þessir liðir eru rangt útfylltir:\n\n',inlineMsgPrefix:'Villa:',inlineReqMsg:'Það þarf að fylla út þennan lið ',inlineTypeMsg:'Þessi liður er rangt út fylltur ',inlineNextError:'Næsta villa',resetAlert:'Ath: Þú ert í þann mund að afturkalla öll innslegin gildi...',fi_kt_fyrirt:'Sláðu inn fyrirtækiskennitölu',fi_kt_einst:'Sláðu inn kennitölu einstaklings',fi_email:{inline:'Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)',alert:'e.g. nafn@domain.is'},fi_url:{inline:'Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)',alert:'e.g. http://www.domain.is'},fi_year:{inline:'Vinsamlega sláðu inn rétt ártal (dæmi: 1998)',alert:'t.d. 1998'},fi_ccnum_noamex:'American Express kort virka ekki',fi_valuemismatch:'Staðfesting stemmir ekki'};
(function(c){c.extend(c.av.lang.en,{fi_kt_fyrirt:'Only company \'kennitala\'s allowed',fi_kt_einst:'Only people\'s \'kennitala\'s allowed',fi_email:{inline:'Please provide a valid e-mail address (example: user@example.com)',alert:'e.g. user@example.com'},fi_url:{inline:'Please provide a valid web address (example: http://www.example.is)',alert:'e.g. http://www.example.com'},fi_year:{inline:'Please provide a valid four digit year (example: 1998)',alert:'e.g. 1998'},fi_ccnum_noamex:{inline:'American Express cards not accepted',alert:'AmEx not accepted'},fi_valuemismatch:'Confirmation doesn\'t match'});var k=c.av.type;c.extend(k,{fi_kt:function(a,f,b){if(a){var e=c.av.getError('fi_kt',b),d=a.replace(/[\s\-]/g,'');c(this).val(d);var g=/010130(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(d);if(g||!/^\d{9}[90]$/.test(d)){return e}var h=[3,2,7,6,5,4,3,2,1],i=0,j=9;while(j--){i+=(h[j]*d.charAt(j))}if(i%11){return e}}return!!a},fi_kt_einst:function(a,f,b){var e=k.fi_kt.call(this,a,f,b);if(e===true){a=c(this).val();if(parseInt(a.substr(0,1),10)>3){e=c.av.getError('fi_kt_einst',b)}}return e},fi_kt_fyrirt:function(a,f,b){var e=k.fi_kt.call(this,a,f,b);if(e===true){e=typeof k.fi_kt_einst.call(this,a,f,b)==='string';if(!e){e=c.av.getError('fi_kt_fyrirt',b)}}return e},fi_email:function(a,f,b){if(a&&!/^[a-z0-9\-._+]+@(?:[a-z0-9\-_]+\.)+[a-z0-9\-_]{2,99}$/i.test(a)){return c.av.getError('fi_email',b)}return!!a},fi_url:function(a,f,b){if(a){if(/^www\./.test(a)){a='http://'+a;c(this).val(a)}if(!/^[a-z]+:\/\/.+\..+$/.test(a)||/[\(\)<\>\,\"\[\]\\\s]/.test(a)){return c.av.getError('fi_url',b)}return true}return false},fi_tel:function(a,f){if(a){var b=f.className.match(/(?:^| )fi_tel_min_(\d+)(?: |$)/);return(!a.replace(/(?:\s|[\-+()]|\d)/g,'')&&(!b||b[1]<=a.replace(/\D/g,'').length))||''}return false},fi_tel_is:function(a){if(a){return(/^(?:\+354)?\d{7}$/).test(a.replace(/[ -()]/g,''))||''}return false},fi_postal_is:function(a,f,b){if(a){var e=c.av.postCodes&&c.av.postCodes.is;if(!e){return(/^\d\d\d$/).test(a)||c.av.getError('fi_pnr',b)}else if(e[a]){if(this.nodeType){var d=c(this).siblings('span.unit');if(!d.length){d=c('<span class="unit"></span>');c(this).after(d)}d.html(e[a])}return true}return c.av.getError('fi_pnr',b)}return false},fi_pnrs:function(a,f,b){if(a){var e=a.replace(/(^[ ,;]+|[ ,;]+$)/g,'').split(/[ ,;]+/);for(var d=0;d<e.length;d++){a=c.av.type.fi_postal_is(e[d],null,b);if(a!==true){return a}}return true}return false},fi_qty:function(a){c(this).val(a);return!a||/^\d+$/.test(a)||''},fi_num:function(a){a=a.replace(/^-\s+/,'-').replace(/[,.]$/,'');c(this).val(a);return!a||(/\d/.test(a)&&/^-?\d*[.,]?\d*$/.test(a))||''},fi_year:function(a,f,b){if(a&&!/^(19|20)\d\d$/.test(a)){return c.av.getError('fi_year',b)}return!!a},fi_date:function(a,f,b){if(a){var e=c.av.getError('fi_year',b);var d=window.datePicker;if(d&&d.VERSION<2){var g=c.av.id(this),h=d.fields[g];if(h){var i=d.parseDate(g);if(!i){return e}else{var j=d.printDateValue(i,h.dateFormat,b).replace(/(^\s+|\s+$)/g,'');if(!h.caseSensitive){a=a.toLowerCase();j=j.toLowerCase()}return(j===a)||d.printDateValue(new Date(2000,4,27),h.dateFormat,b)}}}a=a.replace(/[ .-\/]+/g,'.').replace(/\.(\d\d)$/,'.20$1');return(/^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/).test(a)||e}return!!a},fi_time:function(a,f,b){if(a){var e=c.av.getError('fi_time',b);if((/^([01]?\d|2[01234])(?:[:.]([0-5]\d))?(?:[:.]([0-5]\d))?\s*([ap]\.?m\.?)?$/i).test(a)){var d=RegExp.$1,g=RegExp.$2||'00',h=RegExp.$3,i=(RegExp.$4+'').replace(/\./g,'').toLowerCase();if(i==='pm'){d=1*d+12}var j=(d*60*60+g*60+(h||0)*60)<=86400;j&&c(this).val(d+':'+g+(h?':'+h:'')+i);return j||e}else{return e}}return!!a},fi_ccnum:function(a,f,b){var e=c.av.getError('fi_ccnum',b);if(a){var d=a.replace(/[ \-]/g,'');if(!/^(\d{16}|3[47]\d{13})$/.test(d)){return e}c(this).val(d);var g=0,h,i=d.length;while(i-->0){g+=d.charAt(i--)*1;h=d.charAt(i)*2;g+=Math.floor(h/10)+(h%10)}var j=(g%10)===0;return j||e}return!!a},fi_ccnum_noamex:function(a,f,b){if(a&&a.replace(/[ \-]/g,'').length===15){return c.av.getError('fi_ccnum_noamex',b)}return!!a},fi_ccexp:function(a,f,b){if(a){a=a.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/,'$1/$2').replace(/\s+/g,'');return(/^(0\d|1[012])\/(\d\d)$/).test(a)||c.av.getError('fi_ccexp',b)}return!!a},fi_sameasprev:function(a,f,b){a=c(this).val();if(a){var e=c(this.form).find('.fi_txt>input,select,textarea'),d=e.index(this),g=d>0?e.eq(d-1).val():'';if(g&&a!==g){return c.av.getError('fi_valuemismatch',b)}}return!!a}});k.fi_pnr=k.fi_postal_is})(jQuery);
