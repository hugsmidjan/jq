// encoding: utf-8
(function(d){var x='tmp_'+(new Date()).getTime();var y=0;var v={lang:'en',maxLabelLength:35,errorAction:'focus',focusElmClass:'stream',submittedClass:'issubmitted',validateEachField:'',errorMsgType:'alertonly',inlineErrorClass:'errmsg',nextErrorLinkClass:'nexterror',customReqCheck:{},reqClassPattern:'req',reqErrorClass:'reqerror',typeErrorClass:'typeerror',defangReset:true,defangEnter:'auto',emulateTab:false,maxLengthTab:false};d.extend({av:{lang:{en:{bullet:' • ',errorReqMsg:'Please fill out these fields:\n\n',errorTypeMsg:'These fields contain invalid input:\n\n',inlineMsgPrefix:'Error:',inlineReqMsg:'This field is required ',inlineTypeMsg:'This field contains an invalid value ',inlineNextError:'Next error',resetAlert:'Note: You are about to reset all values in the form...'}},id:function(a){a=d(a);var c=a.attr('id');return(c)?c:a.attr('id',x+'_'+(y++)).attr('id')},cleanLabelString:function(a,c){if(!a){return''}c=c||35;a=a.replace(/\s\s+/g,' ').replace(/ - /g,', ').replace(/\[/g,'(').replace(/\]/g,')').replace(/\([^)]+\)/g,'').replace(/[\s*:#]+$/,'').replace(/^[\s*#]+/,'');if(a.length>(c+2)){a=a.substr(0,(c-2)).replace(/[.,:;\s]+$/,'')+'...'}return a},getLabel:function(a,c,b){var e=a.find(':input:first');var f=e.data('av-labeltext');if(!f){f=d.av.cleanLabelString(e.attr('title'),b.maxLabelLength);var g=e.attr('id');if(!f&&g){var i=e.parents('form').find('label[for='+g+']').text()||e.parent('label').text()||a.find('label').eq(0).text();f=d.av.cleanLabelString(i,b.maxLabelLength)}var j=a.is('fieldset:has(input[name='+e.attr('name')+']:eq(1))');if(j){var k=a.find(':header, legend, p').eq(0).text();f=(k)?d.av.cleanLabelString(k,b.maxLabelLength):f}if(!f){f=e.attr('name')}var h=c.find('fieldset:has(#'+d.av.id(a)+'):last').children(':header:first-child, legend:first-child, p:first-child');if(h.length){f=f+' ['+d.av.cleanLabelString(h.text(),b.maxLabelLength)+']'}d(e).data('av-labeltext',f)}return f},getText:function(a,c){return d.av.getError(a,c)||d.av.getError(a,'en')||''},getError:function(a,c){return(d.av.lang[c]&&d.av.lang[c][a])||''},config:function(a,c){var b=d(a);var e=d(b.filter('form')[0]||b.parents('form')[0]||b.find('form'));if(c){e.data('av-config',c)}else{c=e.data('av-config');if(!c){c=d.extend({},v);e.data('av-config',c)}}return c},addInlineLabels:function(f){var g=d.av.config(f[0]);d.each(f,function(a){var c=d(this);var b=c.attr('lang')||c.parents('[lang]').attr('lang');c.attr('lang',b);var e=d.av.getText('inlineReqMsg',b);if(c.is('.'+g.typeErrorClass)){e=c.data('av-error')||d.av.getText('inlineTypeMsg',b)}c.prepend('<strong class="'+g.inlineErrorClass+'">'+e+'</strong>');if(a<f.length-1){c.append('<a href="#'+d.av.id(f[a+1])+'" class="'+g.nextErrorLinkClass+'">'+d.av.getText('inlineNextError',b)+'</a>')}})},alertErrors:function(e,f){var g=d.av.config(e[0]);var i=d(e[0]).attr('lang')||d(e[0]).parents('[lang]').attr('lang');d(e[0]).attr('lang',i);var j=[];var k=[];var h='';d.each(e,function(a){var c=d(this);var b=d.av.getLabel(c,f,g);if(d(this).is('.'+g.typeErrorClass)){k.push(b)}else{j.push(b)}});var l=d.av.getText('bullet',i);if(j.length){h+=d.av.getText('errorReqMsg',i)+l+j.join('\n'+l)}if(k.length){h+='\n\n';h+=d.av.getText('errorTypeMsg',i)+l+k.join('\n'+l)}alert(d.trim(h))},focusNext:function(f){var g=d(':input').get();g=g.sort(function(a,c){var b=(a.tabIndex>0)?a.tabIndex:99999;var e=(c.tabIndex>0)?c.tabIndex:99999;return((b<e)*-1)+((b>e)*1)});var i=d.inArray(f,g);while(g[++i]&&g[i].tabIndex==-1){}var j=d(g[i]||g[0]);setTimeout(function(){j.trigger('focus')},1);return j}}});var p=function(a){return!!a},w=function(a){var c=d(this);return c.parents('form').find('[name='+c.attr('name')+']').is(':checked')};d.extend(d.av,{type:{'fi_btn':function(a){return true},'fi_txt':p,'fi_sel':p,'fi_bdy':p,'fi_file':p,'fi_chk':w,'fi_rdo':w}});d.fn.extend({defangReset:function(){return this.bind('click',function(a){var c=d(this);var b=c.attr('lang')||c.parents('[lang]').attr('lang')||'en';c.attr('lang',b);if(confirm(d.av.getText('resetAlert',b))){if(c.attr('type')!=="reset"){var e=c.parents('form').get(0);if(e){e.trigger('reset')}}return true}return false})},defangEnter:function(){return this.bind('keydown',function(a){var c=a.target;return(a.keyCode!=13||c.tagName!='INPUT'||/^(button|reset|submit)$/i.test(c.type))})},autoValidate:function(j){return this.each(function(){var f=d(this);var g=d(f.filter('form')[0]||f.parents('form')[0]||f.find('form'));if(!g.length){return false;}var i=d.extend({},v,j);d.av.config(this,i);if(i.defangReset){g.find(':reset').defangReset(i)}if(!i.emulateTab&&i.defangEnter===true||i.defangEnter==='true'||(i.defangEnter==='auto'&&d(':submit',g).length>1)){g.defangEnter()}if(i.emulateTab){g.bind('keydown',function(a){if(a.keyCode==13&&d(a.target).is(':input:not(:button):not(:reset):not(:submit):not(textarea)')){d.av.focusNext(a.target);return false}})}if(i.maxLengthTab){g.bind('keyup',function(a){var c=d(a.target);var b=a.which;if((b>0&&b!=8&&b!=9&&b!=13&&b!=16&&b!=17)&&c.attr('maxlength')==c.val().length){d.av.focusNext(a.target)}})}if(/blur|change/.test(i.validateEachField)){}g.bind('submit',function(a){var c=d(this);var b=d.av.config(this);var e=c.isValid();if(e){c.addClass(b.submittedClass)}else{a.preventDefault()}return e})})},isValid:function(n){n=!!(n||n==null);var o=[],s='',t=false;this.each(function(){var q=d(this),r=[],z=true;conf=d.av.config(this);t=t||/both|alertonly/.test(conf.errorMsgType);s=s||'strong.'+conf.inlineErrorClass+', a.'+conf.nextErrorLinkClass;q.find(s).remove();var A=!q.is(':input')?q.find(':input'):q;A.each(function(){var a=d(this);a.removeData('av-malformed');var c=(this.type=='checkbox')?{'fi_chk':d.av.type['fi_chk']}:{'fi_txt':d.av.type['fi_txt']},b=a.parents('[class^="fi_"], [class*=" fi_"]').eq(0),e=b.attr('lang')||b.parents('[lang]').attr('lang'),f=b.hasClass(conf.reqClassPattern)||a.hasClass(conf.reqClassPattern),g=d.trim(a.val());b.removeClass(conf.reqErrorClass);b.removeClass(conf.typeErrorClass);if(b.length!==0){var i,j=d.trim(b.attr('class')).split(' ');while(i=j.pop()){if(/^fi_/.test(i)&&d.isFunction(d.av.type[i])){c[i]=d.av.type[i]}}}var k=a.attr('name'),h=conf.customReqCheck&&conf.customReqCheck[k];if(h&&d.isFunction(h)){f=h.call(this,g,b.get(0)||this,e)}else if(h&&typeof(h)==='string'){var l=/^(!)?(.*)$/.exec(h);var m=d(':input[name='+l[2]+']',this.form);if(m.length&&('checkbox'==m.attr('type')||'radio'==m.attr('type'))){f=!l[1]^!m.is(':checked')}else if(m.length){f=!l[1]^(m.val()=='')}}if(conf.customTypeCheck&&d.isFunction(conf.customTypeCheck[k])){c[k]=conf.customTypeCheck[k]}for(var B in c){b.attr('lang',e);var u=c[B].call(this,g,b.get(0)||this,e);if(u!==true){z=false;if(typeof(u)==='string'){r.push(b.get(0));b.data('av-error',u);b.removeClass(conf.reqErrorClass);b.addClass(conf.typeErrorClass)}else if(f){r.push(b.get(0));b.addClass(conf.reqErrorClass)}}}});if(n&&/both|inlineonly/.test(conf.errorMsgType)){d.av.addInlineLabels(d.unique(r))}o=o.concat(r)});if(n&&t&&o.length){d.av.alertErrors(d.unique(o),this)}return!o.length}})})(jQuery);jQuery.av.lang.is={bullet:' • ',errorReqMsg:'Það þarf að fylla út þessa liði:\n\n',errorTypeMsg:'Þessir liðir eru rangt útfylltir:\n\n',inlineMsgPrefix:'Villa:',inlineReqMsg:'Það þarf að fylla út þennan lið ',inlineTypeMsg:'Þessi liður er rangt út fylltur ',inlineNextError:'Næsta villa',resetAlert:'Ath: Þú ert í þann mund að afturkalla öll innslegin gildi...',fi_email:'Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)',fi_url:'Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)',fi_year:'Vinsamlega sláðu inn rétt ártal (dæmi: 1998)',fi_ccnum_noamex:'American Express kort virka ekki'};(function(h){h.extend(h.av.lang.en,{fi_email:'Please provide a valid e-mail address (example: user@example.com)',fi_url:'Please provide a valid web address (example: http://www.example.is)',fi_year:'Please provide a valid four digit year (example: 1998)',fi_ccnum_noamex:'American Express cards not accepted'});h.extend(h.av.type,{fi_kt:function(a,c,b){var e=h.av.getError('fi_kt',b);if(a){var f=a.replace(/[\s\-]/g,'');h(this).val(f);var g=/010130[- ]?(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(f);if(!/^\d{9}[90]$/.test(f)||g){return e}var i=[3,2,7,6,5,4,3,2,1],j=0,k=9;while(k--){j+=(i[k]*f.charAt(k))}if(j%11){return e}}return!!a},fi_email:function(a,c,b){if(a&&!/^[a-z0-9-._+]+@([a-z0-9-_]+\.)+[a-z0-9-_]{2,99}$/i.test(a)){return h.av.getError('fi_email',b)}return!!a},fi_url:function(a,c,b){if(a){var e=a.replace(/^[a-z]+:\/\/.+$/i,'');if(!/^[a-z]+:\/\/.+\..+$/.test(a)||/[\(\)\<\>\,\:\"\[\]\\]/.test(e)){return h.av.getError('fi_url',b)}return true}return false},fi_tel:function(a,c,b){if(a){return!a.replace(/(\s|[-+]|\d)/g,'')||''}return false},fi_postal_is:function(a,c,b){if(a){var e=h.av.postCodes&&h.av.postCodes.is;if(!e){return/^\d\d\d$/.test(a)||h.av.getError('fi_pnr',b)}else if(e[a]){if(this.nodeType){var f=h(this).siblings('span.unit');if(!f.length){f=h('<span class="unit"></span>');h(this).after(f)}f.html(e[a])}return true}return h.av.getError('fi_pnr',b)}return false},fi_pnrs:function(a,c,b){if(a){var e=a.replace(/(^[ ,;]+|[ ,;]+$)/g,'').split(/[ ,;]+/);var a,f=false;for(var g=0;g<e.length;g++){a=h.av.type['fi_postal_is'](e[g],null,b);if(a!==true){return a}}return true}return false},fi_qty:function(a,c,b){h(this).val(a);return!a||/^\d+$/.test(a)||''},fi_num:function(a,c,b){var a=a.replace(/^-\s+/,'-').replace(/[,.]$/,'');h(this).val(a);return!a||(/\d/.test(a)&&/^-?\d*[.,]?\d*$/.test(a))||''},fi_year:function(a,c,b){if(a&&!/^(19|20)\d\d$/.test(a)){return h.av.getError('fi_year',b)}return!!a},fi_date:function(a,c,b){if(a){var e=h.av.getError('fi_year',b);if(window.datePicker&&datePicker.VERSION<2){var f=h.av.id(this),g=datePicker.fields[f];if(g){var i=datePicker.parseDate(f);if(!i){return e}else{var j=datePicker.printDateValue(i,g.dateFormat,b).replace(/(^\s+|\s+$)/g,'');if(!g.caseSensitive){a=a.toLowerCase();j=j.toLowerCase()}return(j==a)||datePicker.printDateValue(new Date(2000,4,27),g.dateFormat,b)}}}a=a.replace(/[ .-\/]+/g,'.').replace(/\.(\d\d)$/,'.20$1');return/^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/.test(a)||e}return!!a},fi_time:function(a,c,b){if(a){var e=h.av.getError('fi_time',b);if(/^([01]?\d|2[01234])(:([0-5]\d))?(:([0-5]\d))?\s*([ap]\.?m\.?)?$/i.test(a)){var f=parseInt(RegExp.$1,10),g=parseInt(RegExp.$3||'0',10),i=parseInt(RegExp.$5||'0',10),j=(RegExp.$6+'').replace('.','').toLowerCase();if(j=='pm'){f+=12}var k=(f*60*60)+(g*60)+(i*60);return(k<=86400)||e}else{return e}}return!!a},fi_ccnum:function(a,c,b){var e=h.av.getError('fi_ccnum',b);if(a){var f=a.replace(/[ -]/g,'');if(!/^(\d{16}|3[47]\d{13})$/.test(f)){return e}h(this).val(f);var g=0,i,j=f.length;while(j-->0){g+=f.charAt(j--)*1;i=f.charAt(j)*2;g+=Math.floor(i/10)+(i%10)}var k=(g%10)===0;return k||e}return!!a},fi_ccnum_noamex:function(a,c,b){if(a&&a.replace(/[ -]/g,'').length==15){return h.av.getError('fi_ccnum_noamex',b)}return!!a},fi_ccexp:function(a,c,b){if(a){a=a.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/,'$1/$2').replace(/\s+/g,'');return/^(0\d|1[012])\/(\d\d)$/.test(a)||h.av.getError('fi_ccexp',b)}return!!a}})})(jQuery);
