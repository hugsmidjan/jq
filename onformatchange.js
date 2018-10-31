/* FormatChange  -- (c) 2012-2016 Hugsmiðjan ehf.   @license MIT/GPL */
!function(){var m=window,l=!!m.addEventListener,r=Object.create||function(e){var n=function(){};return n.prototype=e,new n},s=function(e,n){var t=this;if(!(this instanceof s))return new s(e,n);n=n||{},t.win=n.win||t.win,t.elm=n.elm,n.elmTagName&&(t.elmTagName=n.elmTagName),n.elmId&&(t.elmId=n.elmId),"manual"in n&&(t.manual=n.manual),"defer"in n&&(t.defer=n.defer),t.formatGroups=e||r(t.formatGroups),t.media={},t._callbacks=[],t._check=function(){t.check()},!t.defer&&t.start()};s.prototype={elmTagName:"del",elmId:"mediaformat",manual:!1,defer:!1,win:m,formatGroups:{},isRunning:function(){return this._on},start:function(e){var n=this;if(!n._on){var t=n.win;if(!n.elm){var r=t.document,a=n.elmId||"mediaformat",i=n.elm=r.getElementById(a);if(!i){var o=(i=n.elm=r.createElement(n.elmTagName||"del")).style;o.position="absolute",o.visibility=o.overflow="hidden",o.border=o.padding=o.margin=o.width=o.height=0,i.id=a,i._isMine=!0,r.body.appendChild(i)}}n._on=!0,n.manual||(l?t.addEventListener("resize",n._check):t.attachEvent("onresize",n._check)),n.refresh(e)}},stop:function(){var e=this,n=e.elm;e._on&&(e.manual||(l?e.win.removeEventListener("resize",e._check):e.win.detachEvent("onresize",e._check)),n._isMine&&(n.parentNode.removeChild(n),delete e.elm),e._on=!1)},refresh:function(e){var n=this;return e&&(n.oldFormat=null),n._on&&(n.check()||n._updateFlags()),n._on},subscribe:function(e,n){var t=this;e&&(t.unsubscribe(e),t._callbacks.push(e),!1!==n&&t._on&&!t._triggering&&e(t.media))},unsubscribe:function(e){for(var n,t=this._callbacks,r=0;n=t[r];r++)if(n===e){t.splice(r,1);break}},_on:!1,_updateFlags:function(){var e=this.media,n=this.formatGroups;for(var t in n){var r=n[t],a=!(!r||!r[e.is]),i=!(!r||!r[e.was]);e["is"+t]=a,e["was"+t]=i,e["became"+t]=a&&!i,e["left"+t]=!a&&i,!r&&delete n[t]}},check:function(){var e=this;if(e._on){var n=e.media,t=e.oldFormat,r=e.elm,a=e.win.getComputedStyle,i=a&&a(r,":after").getPropertyValue("content");i&&"none"!==i||(i=(a?a(r,null).getPropertyValue("font-family"):r.currentStyle.fontFamily)||"");var o=(i=i.replace(/['"]/g,""))!==t;if(o){n.is=n.format=i,n.was=n.lastFormat=t,e.oldFormat=i,e._updateFlags(),e._triggering=!0;for(var l,c=0;l=e._callbacks[c];c++)l(n);e._triggering=!1}return o}}},s.makeGroups=function(t){var r={};return Object.keys(t).forEach(function(n){var e=t[n].group;e&&e.split(",").forEach(function(e){e=e.trim(),r[e]=r[e]||{},r[e][n]=!0})}),r},s.jQueryPlugin=function(c,u){c.formatChange=function(e,n){var t=(n=n||{}).win||s.prototype.win||m,r="$formatchange_jquery_instances",a=t[r];a||(a=t[r]={});var i=n.eventName||u||"formatchange",o=a[i];if(!o){o=a[i]=new s(e,n);var l="_$triggered";o.subscribe(function(e){c(t).trigger(i,[e])}),c.event.special[i]={add:function(n){setTimeout(function(){var e=n.handler;o._on&&!e[l]&&e.call(t,c.Event(i),o.media)},0)},handle:function(e){var n=e.handleObj.handler;return n[l]=!0,n.apply(this,arguments)}}}return o}},"object"==typeof module&&"object"==typeof module.exports?module.exports=s:m.FormatChange=s;var e=m.jQuery;e&&!e.formatChange&&s.jQueryPlugin(e)}();
