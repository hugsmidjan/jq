/* Selectybox 1.1  -- (c) 2012-2014 Hugsmiðjan ehf. - MIT/GPL   @preserve */
!function(){"use strict";var e,t=window,n=!!t.addEventListener,r=function(e,t){var r="add"===t,s=n?(r?"add":"remove")+"EventListener":(r?"at":"de")+"tachEvent",o=n?"":"on",a=e.select;a[s](o+"change",e._$refresh),a[s](o+"keyup",e._$refresh),a[s](o+"focus",e._$focus),a[s](o+"blur",e._$blur)},s=function(e,t,n){for(var r in t)e.style[r]=n?"":t[r]},o="templ getButton focusClass emptyVal text wrapperCSS selectCSS".split(" "),a="_$refresh _$focus _$blur select container button".split(" "),i=function(t,n){var a=t.$selectybox,c=a||this;if(!(c instanceof i))return new i(t,n);if(a&&a.destroy(),n){for(var l,u=0;l=o[u++];)n[l]&&(c[l]=n[l]);n=null}e=e||document.createElement("div"),e.innerHTML=c.templ.replace(/^[^<]+/,"");var f=c.container=e.firstChild;f.style.position="relative",c.button=c.getButton(),c.select=t,t.parentNode.insertBefore(f,t),f.insertBefore(t,c.button.nextSibling),t.style.opacity=1e-4,s(t,c.selectCSS),c._$refresh=function(){setTimeout(function(){c.refresh()},0)};var d;return c._$blur=function(){d=d||new RegExp("(?:^| )"+c.focusClass+"( |$)"),f.className=f.className.replace(d,"$1")},c._$focus=function(){f.className+=" "+c.focusClass},r(c,"add"),c.refresh(),t.$selectybox=c,a?c:void 0};i.prototype={templ:'<span class="selecty"><span class="selecty-button"/></span>',getButton:function(){return this.container.firstChild},focusClass:"focused",emptyVal:"     ",text:function(e){return e},selectCSS:{position:"absolute",bottom:0,left:0,width:"100%",height:"100%",top:"auto",right:"auto",margin:0,padding:0,border:0},refresh:function(){var e=this,t=e.select;e.button.innerHTML=e.text(t.options[t.selectedIndex].text.replace(/</g,"&lt;"))||e.emptyVal},val:function(e){var t,n=this,r=0;for(e+="";t=n.select.options[r++];)if(t.value===e){t.selected=!0;break}n.refresh()},destroy:function(){var e=this,t=e.select,n=e.container,i=n.parentNode;i.insertBefore(t,n),i.removeChild(n),r(e,"remove"),t.style.opacity="",s(t,e.selectCSS,!0),t.$selectybox="";for(var c=o.concat(a),l=c.length;l--;)delete e[c[l]]}},i.jQueryPlugin=function(e){var t="selectybox-widget";e.fn.selectybox=function(n,r){var s=this;if(/^(?:refresh|val|destroy)$/.test(n))s.each(function(){var s=e(this),o=s.data(t);"destroy"===n&&s.add(o.container).removeData(t),o[n](r)});else if("string"!=typeof n)return n=n||{},n.text=n.text||function(t){return e(this.container).toggleClass("selecty-empty",!e(this.select).val()),t},s.pushStack(s.filter("select").map(function(r,s){var o=i(s,n);return e(s).add(o.container).data(t,o),o.container}));return s}},"object"==typeof module&&module.exports?module.exports=i:(t.Selectybox=i,t.jQuery&&i.jQueryPlugin(t.jQuery))}();