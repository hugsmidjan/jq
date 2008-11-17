(function(D){var B="tmp_"+(new Date()).getTime();var C=0;var A={lang:"en",maxLabelLength:35,errorAction:"focus",focusElmClass:"stream",submittedClass:"issubmitted",validateEachField:"",errorMsgType:"alertonly",inlineErrorClass:"errmsg",nextErrorLinkClass:"nexterror",customReqCheck:{},reqClassPattern:"req",reqErrorClass:"reqerror",typeErrorClass:"typeerror",defangReset:true,defangEnter:"auto",emulateTab:false,maxLengthTab:true};jQuery.extend({av:{lang:{en:{bullet:" • ",errorReqMsg:"Please fill out these fields:\n\n",errorTypeMsg:"These fields contain invalid input:\n\n",inlineMsgPrefix:"Error:",inlineReqMsg:"This field is required ",inlineTypeMsg:"This field contains an invalid value ",inlineNextError:"Next error",resetAlert:"Note: You are about to reset all values in the form..."}},id:function(F){F=D(F);var E=F.attr("id");return(E)?E:F.attr("id",B+"_"+(C++)).attr("id");},cleanLabelString:function(F,E){if(!F){return"";}E=E||35;F=F.replace(/\s\s+/g," ").replace(/ - /g,", ").replace(/\[/g,"(").replace(/\]/g,")").replace(/\([^)]+\)/g,"").replace(/[\s*:#]+$/,"").replace(/^[\s*#]+/,"");if(F.length>(E+2)){F=F.substr(0,(E-2)).replace(/[.,:;\s]+$/,"")+"...";}return F;},getLabel:function(H,G,I){var M=H.find(":input:first");var L=M.data("av-labeltext");if(!L){L=D.av.cleanLabelString(M.attr("title"),I.maxLabelLength);var E=M.attr("id");if(!L&&E){var F=M.parents("form").find("label[for="+E+"]").text()||M.parent("label").text()||H.find("label").eq(0).text();L=D.av.cleanLabelString(F,I.maxLabelLength);}var K=H.is("fieldset:has(input[name="+M.attr("name")+"]:eq(1))");if(K){var J=H.find(":header, legend, p").eq(0).text();L=(J)?D.av.cleanLabelString(J,I.maxLabelLength):L;}if(!L){L=M.attr("name");}var N=G.find("fieldset:has(#"+D.av.id(H)+"):last").children(":header:first-child, legend:first-child, p:first-child");if(N.length){L=L+" ["+D.av.cleanLabelString(N.text(),I.maxLabelLength)+"]";}D(M).data("av-labeltext",L);}return L;},getText:function(F,E){return D.av.getError(F,E)||D.av.getError(F,"en")||"";},getError:function(F,E){return(D.av.lang[E]&&D.av.lang[E][F])||"";},config:function(E,F){var G=D(E);var H=G.is("form")?G:D(G.attr("form")||G.parent("form").get(0));if(F){H.data("av-config",F);}else{F=H.data("av-config");if(!F){F=D.extend({},A);H.data("av-config",F);}}return F;},addInlineLabels:function(F){var E=D.av.config(F[0]);D.each(F,function(H){var I=D(this);var J=I.attr("lang")||I.parents("[lang]").attr("lang");I.attr("lang",J);var G=D.av.getText("inlineReqMsg",J);if(I.is("."+E.typeErrorClass)){G=I.data("av-error")||D.av.getText("inlineTypeMsg",J);}I.prepend('<strong class="'+E.inlineErrorClass+'">'+G+"</strong>");if(H<F.length-1){I.append('<a href="#'+D.av.id(F[H+1])+'" class="'+E.nextErrorLinkClass+'">'+D.av.getText("inlineNextError",J)+"</a>");}});},alertErrors:function(I,L){var E=D.av.config(I[0]);var K=D(I[0]).attr("lang")||D(I[0]).parents("[lang]").attr("lang");D(I[0]).attr("lang",K);var F=[];var H=[];var J="";D.each(I,function(N){var O=D(this);var M=D.av.getLabel(O,L,E);if(D(this).is("."+E.typeErrorClass)){H.push(M);}else{F.push(M);}});var G=D.av.getText("bullet",K);if(F.length){J+=D.av.getText("errorReqMsg",K)+G+F.join("\n"+G);}if(H.length){J+="\n\n";J+=D.av.getText("errorTypeMsg",K)+G+H.join("\n"+G);}alert(D.trim(J));},focusNext:function(F){var G=D(":input").get();G=G.sort(function(K,J){var I=(K.tabIndex>0)?K.tabIndex:99999;var L=(J.tabIndex>0)?J.tabIndex:99999;return((I<L)*-1)+((I>L)*1);});var H=D.inArray(F,G);while(G[++H]&&G[H].tabIndex==-1){}var E=D(G[H]||G[0]);setTimeout(function(){E.focus();},1);return E;},}});jQuery.extend(jQuery.av,{type:{fi_btn:function(F,E){return true;},fi_txt:function(F,E){return F!=="";},fi_sel:function(F,E){return F!=="";},fi_chk:function(F,E){var G=D(this);return G.parents("form").find("[name="+G.attr("name")+"]").is(":checked");},fi_rdo:function(F,E){var G=D(this);return G.parents("form").find("[name="+G.attr("name")+"]").is(":checked");},fi_bdy:function(F,E){return F!=="";},fi_file:function(F,E){return F!=="";}}});jQuery.fn.extend({defangReset:function(){this.each(function(){D(this).click(function(G){var E=D(this);var H=E.attr("lang")||E.parents("[lang]").attr("lang")||"en";E.attr("lang",H);if(confirm(D.av.getText("resetAlert",H))){if(E.attr("type")!=="reset"){var F=E.parents("form").get(0);if(F){F.reset();}}return true;}return false;});});return this;},defangEnter:function(){this.each(function(){D(this).keydown(function(F){var E=F.target;if(F.keyCode==13&&E.tagName==="INPUT"&&/^(button|reset|submit)$/i.test(E.type)){return false;}return true;});});return this;},autoValidate:function(E){this.each(function(){var G=D(this);var H=G.is("form")?G:D(this.form||G.parent("form").get(0));var F=D.extend({},A,E);D.av.config(this,F);if(F.defangReset){H.find(":reset").defangReset(F);}if(!F.emulateTab&&F.defangEnter===true||F.defangEnter==="true"||(F.defangEnter==="auto"&&H.attr("method")=="post"||H.is(":has(:submit:eq(1))"))){H.defangEnter();}if(F.emulateTab){H.keydown(function(I){if(I.keyCode==13&&D(I.target).is(":input:not(:button):not(:reset):not(:submit):not(textarea)")){D.av.focusNext(I.target);return false;}});}if(F.maxLengthTab){H.keyup(function(K){var J=D(K.target);var I=K.which;if((I>0&&I!=8&&I!=9&&I!=13&&I!=16&&I!=17)&&J.attr("maxlength")==J.val().length){D.av.focusNext(K.target);}});}if(/blur|change/.test(F.validateEachField)){}H.submit(function(K){var J=D(this);var L=D.av.config(this);var I=J.isValid();if(I){J.addClass(L.submittedClass);}return I;});});},isValid:function(G){var F=[];var E="";G=(G||G==null)?true:false;var H=false;this.each(function(){var K=D(this);var I=[];var L=true;conf=D.av.config(this);H=H||/both|alertonly/.test(conf.errorMsgType);E=E||"strong."+conf.inlineErrorClass+", a."+conf.nextErrorLinkClass;K.find(E).remove();var J=!K.is(":input")?K.find(":input"):K;J.each(function(){var S=D(this);S.removeData("av-malformed");var P=(this.type=="checkbox")?{fi_chk:D.av.type.fi_chk}:{fi_txt:D.av.type.fi_txt};var N=S.parents("[class~=fi_]");var O=N.attr("lang")||N.parents("[lang]").attr("lang");var U=N.hasClass(conf.reqClassPattern)||S.hasClass(conf.reqClassPattern);var W=D.trim(S.val());N.removeClass(conf.reqErrorClass);N.removeClass(conf.typeErrorClass);if(N.length!==0){var V,Z=D.trim(N.attr("class")).split(" ");while(V=Z.pop()){if(/^fi_/.test(V)&&D.isFunction(D.av.type[V])){P[V]=D.av.type[V];}}}var M=S.attr("name");var R=conf.customReqCheck&&conf.customReqCheck[M];if(R&&D.isFunction(R)){U=R.call(this,W,N.get(0)||this,O);}else{if(R&&typeof (R)==="string"){var Q=/^(!)?(.*)$/.exec(R);var Y=D(":input[name="+Q[2]+"]",this.form);if(Y.length&&("checkbox"==Y.attr("type")||"radio"==Y.attr("type"))){U=!Q[1]^!Y.is(":checked");}else{if(Y.length){U=!Q[1]^(Y.val()=="");}}}}if(conf.customTypeCheck&&D.isFunction(conf.customTypeCheck[M])){P[M]=conf.customTypeCheck[M];}for(var X in P){N.attr("lang",O);var T=P[X].call(this,W,N.get(0)||this,O);if(T!==true){L=false;if(typeof (T)==="string"){I.push(N.get(0));N.data("av-error",T);N.removeClass(conf.reqErrorClass);N.addClass(conf.typeErrorClass);}else{if(U){I.push(N.get(0));N.addClass(conf.reqErrorClass);}}}}});if(G&&/both|inlineonly/.test(conf.errorMsgType)){D.av.addInlineLabels(D.unique(I));}F=F.concat(I);});if(G&&H&&F.length){D.av.alertErrors(D.unique(F),this);}return !F.length;}});})(jQuery);jQuery.extend(jQuery.av.lang,{is:{bullet:" • ",errorReqMsg:"Það þarf að fylla út þessa liði:\n\n",errorTypeMsg:"Þessir liðir eru rangt útfylltir:\n\n",inlineMsgPrefix:"Villa:",inlineReqMsg:"Það þarf að fylla út þennan lið ",inlineTypeMsg:"Þessi liður er rangt út fylltur ",inlineNextError:"Næsta villa",resetAlert:"Ath: Þú ert � þann mund að afturkalla öll innslegin gildi...",fi_email:"Vinsamlega sláðu inn rétt netfang (dæmi: notandi@daemi.is)",fi_url:"Vinsamlega sláðu inn löggilda vefslóð (dæmi: http://www.example.is)",fi_year:"Vinsamlega sláðu inn rétt ártal (dæmi: 1998)",}});jQuery.extend(jQuery.av.lang.en,{fi_email:"Please provide a valid e-mail address (example: user@example.com)",fi_url:"Please provide a valid web address (example: http://www.example.is)",fi_year:"Please provide a valid four digit year (example: 1998)"});jQuery.extend(jQuery.av.type,{fi_kt:function(I,H,A){var D=jQuery.av.getError("fi_kt",A);if(I){var E=I.replace(/[\s\-]/g,"");jQuery(this).val(E);var F=/010130[- ]?(2(12|20|39|47|55|63|71|98)|3(01|36)|4(33|92)|506|778)9/.test(E);if(!/^\d{9}[90]$/.test(E)||F){return D;}var G=[3,2,7,6,5,4,3,2,1],B=0,C=9;while(C--){B+=(G[C]*E.charAt(C));}if(B%11){return D;}}return(I!="");},fi_email:function(B,A,C){if(B&&!/^[a-z0-9-._+]+@([a-z0-9-_]+\.)+[a-z0-9-_]{2,99}$/i.test(B)){return jQuery.av.getError("fi_email",C);}return(B!="");},fi_url:function(B,A,D){if(B){var C=B.replace(/^[a-z]+:\/\/.+$/i,"");if(!/^[a-z]+:\/\/.+\..+$/.test(B)||/[\(\)\<\>\,\:\"\[\]\\]/.test(C)){return jQuery.av.getError("fi_url",D);}return true;}return false;},fi_tel:function(B,A,C){if(B){return !B.replace(/(\s|[-+]|\d)/g,"")||"";}return false;},fi_postal_is:function(C,A,E){if(C){var B=jQuery.av.postCodes&&jQuery.av.postCodes.is;if(!B){return/^\d\d\d$/.test(C)||jQuery.av.getError("fi_pnr",E);}else{if(B[C]){if(this.nodeType){var D=jQuery(this).siblings("span.unit");if(!D.length){D=jQuery('<span class="unit"></span>');jQuery(this).after(D);}D.html(B[C]);}return true;}}return jQuery.av.getError("fi_pnr",E);}return false;},fi_pnrs:function(B,A,F){if(B){var E=B.replace(/(^[ ,;]+|[ ,;]+$)/g,"").split(/[ ,;]+/);var B,D=false;for(var C=0;C<E.length;C++){B=jQuery.av.type.fi_postal_is(E[C],null,F);if(B!==true){return B;}}return true;}return false;},fi_qty:function(B,A,C){jQuery(this).val(B);return !B||/^\d+$/.test(B)||"";},fi_num:function(B,A,C){var B=B.replace(/^-\s+/,"-").replace(/[,.]$/,"");jQuery(this).val(B);return !B||(/\d/.test(B)&&/^-?\d*[.,]?\d*$/.test(B))||"";},fi_year:function(B,A,C){if(B&&!/^(19|20)\d\d$/.test(B)){return jQuery.av.getError("fi_year",C);}return(B!="");},fi_date:function(B,A,G){if(B){var D=jQuery.av.getError("fi_year",G);if(window.datePicker&&datePicker.VERSION<2){var E=$.av.id(this),F=datePicker.fields[E];if(F){var C=datePicker.parseDate(E);if(!C){return D;}else{var H=datePicker.printDateValue(C,F.dateFormat,G).replace(/(^\s+|\s+$)/g,"");if(!F.caseSensitive){B=B.toLowerCase();H=H.toLowerCase();}return(H!=B)||D;}}}B=B.replace(/[ .-\/]+/g,".").replace(/\.(\d\d)$/,".20$1");return/^(3[01]|[12]?[0-9]|(0)?[1-9])\.(1[012]|(0)?[1-9])\.(19|20)?\d\d$/.test(B)||D;}return(B!="");},fi_time:function(G,F,A){if(G){var E=jQuery.av.getError("fi_time",A);if(/^([01]?\d|2[01234])(:([0-5]\d))?(:([0-5]\d))?\s*([ap]\.?m\.?)?$/i.test(G)){var D=parseInt(RegExp.$1,10),C=parseInt(RegExp.$3||"0",10),I=parseInt(RegExp.$5||"0",10),H=(RegExp.$6+"").replace(".","").toLowerCase();if(H=="pm"){D+=12;}var B=(D*60*60)+(C*60)+(I*60);return(B<=86400)||E;}else{return E;}}return(G!="");},fi_ccnum:function(C,A,G){var D=jQuery.av.getError("fi_ccnum",G);if(C){var H=C.replace(/[ -]/g,"");if(!/^\d{16}$/.test(H)){return D;}var B=0;for(var E=0;E<H.length;E++){if((E%2)===0){var F=H.charAt(E)*2;B+=(F>9)?Math.floor((F/10)+(F%10)):F;}else{B+=H.charAt(E)*1;}}return((B%10)===0)||D;}return(C!="");},fi_ccexp:function(B,A,C){if(B){B=B.replace(/(\d\d)\s*[ -\/]?\s*(\d\d)/,"$1/$2").replace(/\s+/g,"");return/^(0\d|1[012])\/(\d\d)$/.test(B)||jQuery.av.getError("fi_ccexp",C);}return(B!="");}});