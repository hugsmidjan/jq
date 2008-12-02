(function($){$.widget("ui.autocomplete",{_init:function(){$.extend(this.options,{delay:this.options.url?$.Autocompleter.defaults.delay:10,max:!this.options.scroll?10:150,highlight:this.options.highlight||function(a){return a},formatMatch:this.options.formatMatch||this.options.formatItem});new $.Autocompleter(this.element[0],this.options)},result:function(a){return this.element.bind("result",a)},search:function(a){return this.element.trigger("search",[a])},flushCache:function(){return this.element.trigger("flushCache")},setData:function(a,b){return this.element.trigger("setOptions",[{key:b}])},destroy:function(){return this.element.trigger("unautocomplete")}});$.Autocompleter=function(j,k){var l={UP:38,DOWN:40,DEL:46,TAB:9,RETURN:13,ESC:27,COMMA:188,PAGEUP:33,PAGEDOWN:34,BACKSPACE:8};var m=$(j).attr("autocomplete","off").addClass(k.inputClass);if(k.result)m.bind('result.autocomplete',k.result);var n;var o="";var p=$.Autocompleter.Cache(k);var r=0;var s;var t={mouseDownOnSelect:false};var u=$.Autocompleter.Select(k,j,selectCurrent,t);var w;$.browser.opera&&$(j.form).bind("submit.autocomplete",function(){if(w){w=false;return false}});m.bind(($.browser.opera?"keypress":"keydown")+".autocomplete",function(a){s=a.keyCode;switch(a.keyCode){case l.UP:a.preventDefault();if(u.visible()){u.prev()}else{onChange(0,true)}break;case l.DOWN:a.preventDefault();if(u.visible()){u.next()}else{onChange(0,true)}break;case l.PAGEUP:a.preventDefault();if(u.visible()){u.pageUp()}else{onChange(0,true)}break;case l.PAGEDOWN:a.preventDefault();if(u.visible()){u.pageDown()}else{onChange(0,true)}break;case k.multiple&&$.trim(k.multipleSeparator)==","&&l.COMMA:case l.TAB:case l.RETURN:if(selectCurrent()){a.preventDefault();w=true;return false}break;case l.ESC:u.hide();break;default:clearTimeout(n);n=setTimeout(onChange,k.delay);break}}).focus(function(){r++}).blur(function(){r=0;if(!t.mouseDownOnSelect){hideResults()}}).click(function(){if(r++>1&&!u.visible()){onChange(0,true)}}).bind("search",function(){var c=(arguments.length>1)?arguments[1]:null;function findValueCallback(q,a){var b;if(a&&a.length){for(var i=0;i<a.length;i++){if(a[i].result.toLowerCase()==q.toLowerCase()){b=a[i];break}}}if(typeof c=="function")c(b);else m.trigger("result",b&&[b.data,b.value])}$.each(trimWords(m.val()),function(i,a){request(a,findValueCallback,findValueCallback)})}).bind("flushCache",function(){p.flush()}).bind("setOptions",function(){$.extend(k,arguments[1]);if("data"in arguments[1])p.populate()}).bind("unautocomplete",function(){u.unbind();m.unbind();$(j.form).unbind(".autocomplete")});function selectCurrent(){var a=u.selected();if(!a)return false;var v=a.result;o=v;if(k.multiple){var b=trimWords(m.val());if(b.length>1){v=b.slice(0,b.length-1).join(k.multipleSeparator)+k.multipleSeparator+v}v+=k.multipleSeparator}m.val(v);hideResultsNow();m.trigger("result",[a.data,a.value]);return true}function onChange(a,b){if(s==l.DEL){u.hide();return}var c=m.val();if(!b&&c==o)return;o=c;c=lastWord(c);if(c.length>=k.minChars){m.addClass(k.loadingClass);if(!k.matchCase)c=c.toLowerCase();request(c,receiveData,hideResultsNow)}else{stopLoading();u.hide()}};function trimWords(b){if(!b){return[""]}var c=b.split(k.multipleSeparator);var d=[];$.each(c,function(i,a){if($.trim(a))d[i]=$.trim(a)});return d}function lastWord(a){if(!k.multiple)return a;var b=trimWords(a);return b[b.length-1]}function autoFill(q,a){if(k.autoFill&&(lastWord(m.val()).toLowerCase()==q.toLowerCase())&&s!=l.BACKSPACE){m.val(m.val()+a.substring(lastWord(o).length));$.Autocompleter.Selection(j,o.length,o.length+a.length)}};function hideResults(){clearTimeout(n);n=setTimeout(hideResultsNow,200)};function hideResultsNow(){var c=u.visible();u.hide();clearTimeout(n);stopLoading();if(k.mustMatch){m.autocomplete("search",function(a){if(!a){if(k.multiple){var b=trimWords(m.val()).slice(0,-1);m.val(b.join(k.multipleSeparator)+(b.length?k.multipleSeparator:""))}else m.val("")}})}if(c)$.Autocompleter.Selection(j,j.value.length,j.value.length)};function receiveData(q,a){if(a&&a.length&&r){stopLoading();u.display(a,q);autoFill(q,a[0].value);u.show()}else{hideResultsNow()}};function request(c,d,e){if(!k.matchCase)c=c.toLowerCase();var f=p.load(c);if(f&&f.length){d(c,f)}else if((typeof k.url=="string")&&(k.url.length>0)){var g={timestamp:+new Date()};$.each(k.extraParams,function(a,b){g[a]=typeof b=="function"?b():b});$.ajax({mode:"abort",port:"autocomplete"+j.name,dataType:k.dataType,url:k.url,data:$.extend({q:lastWord(c),limit:k.max},g),success:function(a){var b=k.parse&&k.parse(a)||parse(a);p.add(c,b);d(c,b)}})}else if(k.source&&typeof k.source=='function'){var h=k.source(c);var i=(k.parse)?k.parse(h):h;p.add(c,i);d(c,i)}else{u.emptyList();e(c)}};function parse(a){var b=[];var c=a.split("\n");for(var i=0;i<c.length;i++){var d=$.trim(c[i]);if(d){d=d.split("|");b[b.length]={data:d,value:d[0],result:k.formatResult&&k.formatResult(d,d[0])||d[0]}}}return b};function stopLoading(){m.removeClass(k.loadingClass)}};$.Autocompleter.defaults={inputClass:"ui-autocomplete-input",resultsClass:"ui-autocomplete-results",loadingClass:"ui-autocomplete-loading",minChars:1,delay:400,matchCase:false,matchSubset:true,matchContains:false,cacheLength:10,max:100,mustMatch:false,extraParams:{},selectFirst:true,formatItem:function(a){return a[0]},formatMatch:null,autoFill:false,width:0,multiple:false,multipleSeparator:", ",highlight:function(a,b){return a.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+b.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>")},scroll:true,scrollHeight:180};$.extend($.ui.autocomplete,{defaults:$.Autocompleter.defaults});$.Autocompleter.Cache=function(g){var h={};var j=0;function matchSubset(s,a){if(!g.matchCase)s=s.toLowerCase();var i=s.indexOf(a);if(i==-1)return false;return i==0||g.matchContains};function add(q,a){if(j>g.cacheLength){flush()}if(!h[q]){j++}h[q]=a}function populate(){if(!g.data)return false;var b={},nullData=0;if(!g.url)g.cacheLength=1;b[""]=[];for(var i=0,ol=g.data.length;i<ol;i++){var c=g.data[i];c=(typeof c=="string")?[c]:c;var d=g.formatMatch(c,i+1,g.data.length);if(d===false)continue;var e=d.charAt(0).toLowerCase();if(!b[e])b[e]=[];var f={value:d,data:c,result:g.formatResult&&g.formatResult(c)||d};b[e].push(f);if(nullData++<g.max){b[""].push(f)}};$.each(b,function(i,a){g.cacheLength++;add(i,a)})}setTimeout(populate,25);function flush(){h={};j=0}return{flush:flush,add:add,populate:populate,load:function(q){if(!g.cacheLength||!j)return null;if(!g.url&&g.matchContains){var a=[];for(var k in h){if(k.length>0){var c=h[k];$.each(c,function(i,x){if(matchSubset(x.value,q)){a.push(x)}})}}return a}else if(h[q]){return h[q]}else if(g.matchSubset){for(var i=q.length-1;i>=g.minChars;i--){var c=h[q.substr(0,i)];if(c){var a=[];$.each(c,function(i,x){if(matchSubset(x.value,q)){a[a.length]=x}});return a}}}return null}}};$.Autocompleter.Select=function(e,f,g,h){var j={ACTIVE:"ui-autocomplete-over"};var k,active=-1,data,term="",needsInit=true,element,list;function init(){if(!needsInit)return;element=$("<div/>").hide().addClass(e.resultsClass).css("position","absolute").appendTo(document.body);list=$("<ul/>").appendTo(element).mouseover(function(a){if(target(a).nodeName&&target(a).nodeName.toUpperCase()=='LI'){active=$("li",list).removeClass(j.ACTIVE).index(target(a));$(target(a)).addClass(j.ACTIVE)}}).click(function(a){$(target(a)).addClass(j.ACTIVE);g();f.focus();return false}).mousedown(function(){h.mouseDownOnSelect=true}).mouseup(function(){h.mouseDownOnSelect=false});if(e.width>0)element.css("width",e.width);needsInit=false}function target(a){var b=a.target;while(b&&b.tagName!="LI")b=b.parentNode;if(!b)return[];return b}function moveSelect(a){k.slice(active,active+1).removeClass(j.ACTIVE);movePosition(a);var b=k.slice(active,active+1).addClass(j.ACTIVE);if(e.scroll){var c=0;k.slice(0,active).each(function(){c+=this.offsetHeight});if((c+b[0].offsetHeight-list.scrollTop())>list[0].clientHeight){list.scrollTop(c+b[0].offsetHeight-list.innerHeight())}else if(c<list.scrollTop()){list.scrollTop(c)}}};function movePosition(a){active+=a;if(active<0){active=k.size()-1}else if(active>=k.size()){active=0}}function limitNumberOfItems(a){return e.max&&e.max<a?e.max:a}function fillList(){list.empty();var a=limitNumberOfItems(data.length);for(var i=0;i<a;i++){if(!data[i])continue;var b=e.formatItem(data[i].data,i+1,a,data[i].value,term);if(b===false)continue;var c=$("<li/>").html(e.highlight(b,term)).addClass(i%2==0?"ui-autocomplete-even":"ui-autocomplete-odd").appendTo(list)[0];$.data(c,"ui-autocomplete-data",data[i])}k=list.find("li");if(e.selectFirst){k.slice(0,1).addClass(j.ACTIVE);active=0}if($.fn.bgiframe)list.bgiframe()}return{display:function(d,q){init();data=d;term=q;fillList()},next:function(){moveSelect(1)},prev:function(){moveSelect(-1)},pageUp:function(){if(active!=0&&active-8<0){moveSelect(-active)}else{moveSelect(-8)}},pageDown:function(){if(active!=k.size()-1&&active+8>k.size()){moveSelect(k.size()-1-active)}else{moveSelect(8)}},hide:function(){element&&element.hide();k&&k.removeClass(j.ACTIVE)active=-1;$(f).triggerHandler("autocompletehide",[{},{options:e}],e["hide"])},visible:function(){return element&&element.is(":visible")},current:function(){return this.visible()&&(k.filter("."+j.ACTIVE)[0]||e.selectFirst&&k[0])},show:function(){var a=$(f).offset();element.css({width:typeof e.width=="string"||e.width>0?e.width:$(f).width(),top:a.top+f.offsetHeight,left:a.left}).show();if(e.scroll){list.scrollTop(0);list.css({maxHeight:e.scrollHeight,overflow:'auto'});if($.browser.msie&&typeof document.body.style.maxHeight==="undefined"){var b=0;k.each(function(){b+=this.offsetHeight});var c=b>e.scrollHeight;list.css('height',c?e.scrollHeight:b);if(!c){k.width(list.width()-parseInt(k.css("padding-left"))-parseInt(k.css("padding-right")))}}}$(f).triggerHandler("autocompleteshow",[{},{options:e}],e["show"])},selected:function(){var a=k&&k.filter("."+j.ACTIVE).removeClass(j.ACTIVE);return a&&a.length&&$.data(a[0],"ui-autocomplete-data")},emptyList:function(){list&&list.empty()},unbind:function(){element&&element.remove()}}};$.Autocompleter.Selection=function(a,b,c){if(a.createTextRange){var d=a.createTextRange();d.collapse(true);d.moveStart("character",b);d.moveEnd("character",c);d.select()}else if(a.setSelectionRange){a.setSelectionRange(b,c)}else{if(a.selectionStart){a.selectionStart=b;a.selectionEnd=c}}a.focus()}})(jQuery);