/* $.fn.editedSeach 1.0  -- (c) 2016-2017 Hugsmiðjan ehf. @preserve */
!function(e){var a=function(a,t){var r,c=a.find("input:text"),n=window.ga&&window.ga.eventPing?window.ga.eventPing:function(){},i=e.debounceFn(function(e){n("sitessearch-box","ac-result",e)},800);c.autocomplete({minLength:t.minSearchLength,delay:t.searchDelay,autoFocus:t.autoFocus,appendTo:a,source:function(a,c){var n=this.element,o=e(n[0].form);i.cancel(),r&&r.abort(),r=e.ajax({url:t.ajaxSearchUrl,data:o.serialize()+"&"+e.param(t.ajaxParams)}).done(function(r){var n=e(e.imgSuppress(r)),o=[],s=[];if(n.find(t.editedSearchSelector+" a").each(function(e,a){o.push({label:a.innerHTML,url:a.href,pos:e+1})}),t.includeNormalSearch?(o.forEach(function(e){e.className="curated-result"}),n.find(t.normalSearchSelector+" .item > h3 > a").each(function(e,a){s.push({className:"regular-result",label:a.innerHTML,url:a.href,pos:"regular "+(e+1)})})):o.push({label:t.searchForText+' <strong>"'+a.term+'"</strong>',className:"search",isSearchAction:!0}),t.useGaPing){var l=" | curated:"+o.length,h=t.includeNormalSearch?" | regular:"+s.length:"";i(a.term+l+h)}c(o.push.apply(o,s))})},position:{},html:!0}).on("autocompletefocus",function(e){e.preventDefault()}).on("autocompleteselect",function(a,r){if(a.preventDefault(),r.item.isSearchAction){var c=e(this).autocomplete("widget").children().length;t.useGaPing&&n("sitessearch-box","ac-click-search",this.value+" | curated:"+c),e(this).closest("form").submit()}else t.useGaPing&&n("sitessearch-box","ac-click",this.value+" | listPos:"+r.item.pos+" | "+r.item.url),location.href=r.item.url})};e.fn.editedSearch=function(t){var r={ajaxSearchUrl:"/search",useGaPing:!1,searchForText:"is"===e.lang()?"Leita að ":"Search for ",ajaxParams:{justPicPos:"pgmain"},editedSearchSelector:".curatedsearch",includeNormalSearch:!1,normalSearchSelector:".searchresults",minSearchLength:1,searchDelay:200,autoFocus:!1},c=e.extend(r,t);return"editedSearchSelextor"in t&&(console.warn("Please rename option `editedSearchSelextor` to `editedSearchSelector`"),c.editedSearchSelector=t.editedSearchSelextor),e.fn.editedSeach=function(){console.warn("Please rename `editedSeach()` to `editedSearch()`"),e.fn.editedSearch.apply(this,[].call.slice(arguments))},this.each(function(){a(e(this),c)})}}(window.jQuery);
