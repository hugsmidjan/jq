/* FormatChange  -- (c) 2012-2016 Hugsmiðjan ehf.   @license MIT/GPL */
!function(){"use strict";var m=window,l=!!m.addEventListener,a=Object.create||function(e){var n=function(){};return n.prototype=e,new n},u=function(e,n){var t=this;if(!(this instanceof u))return new u(e,n);n=n||{},t.win=n.win||t.win,t.elm=n.elm,n.elmTagName&&(t.elmTagName=n.elmTagName),n.elmId&&(t.elmId=n.elmId),"manual"in n&&(t.manual=n.manual),"defer"in n&&(t.defer=n.defer),t.formatGroups=e||a(t.formatGroups),t.media={},t._callbacks=[],t._check=function(){t.check()},!t.defer&&t.start()};u.prototype={elmTagName:"del",elmId:"mediaformat",manual:!1,defer:!1,win:m,formatGroups:{},isRunning:function(){return this._on},start:function(e){var n=this;if(!n._on){var t=n.win;if(!n.elm){var a=t.document,r=n.elmId||"mediaformat",i=n.elm=a.getElementById(r);if(!i){var o=(i=n.elm=a.createElement(n.elmTagName||"del")).style;o.position="absolute",o.visibility=o.overflow="hidden",o.border=o.padding=o.margin=o.width=o.height=0,i.id=r,i._isMine=!0,a.body.appendChild(i)}}n._on=!0,n.manual||(l?t.addEventListener("resize",n._check):t.attachEvent("onresize",n._check)),n.refresh(e)}},stop:function(){var e=this,n=e.elm;e._on&&(e.manual||(l?e.win.removeEventListener("resize",e._check):e.win.detachEvent("onresize",e._check)),n._isMine&&(n.parentNode.removeChild(n),delete e.elm),e._on=!1)},refresh:function(e){var n=this;return e&&(n.oldFormat=null),n._on&&(n.check()||n._updateFlags()),n._on},subscribe:function(e,n){var t=this;e&&(t.unsubscribe(e),t._callbacks.push(e),!1!==n&&t._on&&!t._triggering&&e(t.media))},unsubscribe:function(e){for(var n,t=this._callbacks,a=0;n=t[a];a++)if(n===e){t.splice(a,1);break}},_on:!1,_updateFlags:function(){var e=this.media,n=this.formatGroups;for(var t in n){var a=n[t],r=!(!a||!a[e.is]),i=!(!a||!a[e.was]);e["is"+t]=r,e["was"+t]=i,e["became"+t]=r&&!i,e["left"+t]=!r&&i,!a&&delete n[t]}},check:function(){var e=this;if(e._on){var n=e.media,t=e.oldFormat,a=e.elm,r=e.win.getComputedStyle,i=r&&r(a,":after").getPropertyValue("content");i&&"none"!==i||(i=(r?r(a,null).getPropertyValue("font-family"):a.currentStyle.fontFamily)||"");var o=(i=i.replace(/['"]/g,""))!==t;if(o){n.is=n.format=i,n.was=n.lastFormat=t,e.oldFormat=i,e._updateFlags(),e._triggering=!0;for(var l,s=0;l=e._callbacks[s];s++)l(n);e._triggering=!1}return o}}},u.jQueryPlugin=function(s,c){s.formatChange=function(e,n){var t=(n=n||{}).win||u.prototype.win||m,a="$formatchange_jquery_instances",r=t[a];r||(r=t[a]={});var i=n.eventName||c||"formatchange",o=r[i];if(!o){o=r[i]=new u(e,n);var l="_$triggered";o.subscribe(function(e){s(t).trigger(i,[e])}),s.event.special[i]={add:function(n){setTimeout(function(){var e=n.handler;o._on&&!e[l]&&e.call(t,s.Event(i),o.media)},0)},handle:function(e){var n=e.handleObj.handler;return n[l]=!0,n.apply(this,arguments)}}}return o}},"object"==typeof module&&"object"==typeof module.exports?module.exports=u:m.FormatChange=u;var e=m.jQuery;e&&!e.formatChange&&u.jQueryPlugin(e)}();

