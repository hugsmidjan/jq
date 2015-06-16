/* FormatChange  -- (c) 2012-2014 Hugsmiðjan ehf.   @license MIT/GPL */
!function(){"use strict";var e=window,t=document,r=!!e.addEventListener,a=Object.create||function(e){var t=function(){};return t.prototype=e,new t},n=function(e,t){var r=this;return this instanceof n?(t=t||{},t.elmTagName&&(r.elmTagName=t.elmTagName),t.elmId&&(r.elmId=t.elmId),"defer"in t&&(r.defer=t.defer),r.formatGroups=e?e:a(r.formatGroups),r.media={},r._callbacks=[],r._$hdl=function(){r._getFormat()},!r.defer&&r.start(),void 0):new n(e,t)};n.prototype={elmTagName:"del",elmId:"mediaformat",defer:!1,formatGroups:{},isRunning:function(){return this._on},start:function(a){var n=this;if(!n._on){var o=n._elm=t.createElement(n.elmTagName||"del"),i=o.style;i.position="absolute",i.visibility=i.overflow="hidden",i.width=i.height=0,o.id=n.elmId||"mediaformat",t.body.appendChild(o),n._on=!0,r?e.addEventListener("resize",n._$hdl):e.attachEvent("onresize",n._$hdl),n.refresh(a)}},stop:function(){var t=this,a=t._elm;t._on&&(r?e.removeEventListener("resize",t._$hdl):e.detachEvent("onresize",t._$hdl),a.parentNode.removeChild(a),delete t._elm,t._on=!1)},refresh:function(e){e&&(this.oldFormat=null),this._getFormat(),this._updateFlags()},subscribe:function(e){var t=this;e&&(t.unsubscribe(e),t._callbacks.push(e),t._on&&!t._triggering&&e(t.media))},unsubscribe:function(e){for(var t,r=this._callbacks,a=0;t=r[a];a++)if(t===e){r.splice(a,1);break}},_on:!1,_updateFlags:function(){var e=this,t=e.media,r=e.formatGroups;for(var a in r){var n=r[a],o=!(!n||!n[t.format]),i=!(!n||!n[t.lastFormat]);t["is"+a]=o,t["was"+a]=i,t["became"+a]=o&&!i,t["left"+a]=!o&&i,!n&&delete r[a]}},_getFormat:function(){var t=this,r=t.media,a=t.oldFormat,n=t._elm,o=e.getComputedStyle,i=o&&o(n,":after").getPropertyValue("content");if(i&&"none"!==i||(i=(o?o(n,null).getPropertyValue("font-family"):n.currentStyle.fontFamily)||""),i=i.replace(/['"]/g,""),i!==a){r.format=i,r.lastFormat=a,t.oldFormat=i,t._updateFlags(),t._triggering=!0;for(var l,s=0;l=t._callbacks[s];s++)l(r);t._triggering=!1}}},n.jQueryPlugin=function(t,r){var a={};t.formatChange=function(o,i){i=i||{};var l=i.eventName||r||"formatchange";if(!a[l]){var s=a[l]=new n(o,i),d="_$triggered";s.subscribe(function(r){t(e).trigger(l,[r])}),t.event.special[l]={add:function(r){setTimeout(function(){var a=r.handler;s._on&&!a[d]&&a.call(e,t.Event(l),s.media)},0)},handle:function(e){var t=e.handleObj.handler;return t[d]=!0,t.apply(this,arguments)}}}return s}},"object"==typeof module&&"object"==typeof module.exports?module.exports=n:(e.FormatChange=n,e.jQuery&&n.jQueryPlugin(e.jQuery))}();