// encoding: utf-8
// $.fn.fickle 2.0  -- (c) 2009-2011 Hugsmiðjan ehf. 
(function(d,p){var h=function(b,a,e){var c=d.Event(l+a);c.cfg=e;b.trigger(c);return!c.isDefaultPrevented()},i=document,l='fickle',q,m,r=function(b){clearTimeout(q)},s={open:function(a,e){var c=a.c;c.opener=(e&&e.opener)||c.opener;if(!a._0&&h(this,'open',c)){var g=c.focusElm;focusTarget=g?(g.charAt?this.find(g):g):[];a._1=p;c.fickle&&d(i).on('focusin click',a._2);c.closeOnEsc&&d(i).on('keydown',a._3);a._0=!0;c.fadein&&this.fadeIn(c.fadein);this.queue(function(){var b=d(this);b.unhide();h(b,'opened',c);a._1||d(focusTarget[0]||this).focusHere();b.dequeue()})}},close:function(a){var e=a.c;if(a._0&&h(this,'close',e)){d(i).off('focusin click',a._2).off('keydown',a._3);d.focusHere(e.opener||i.body);a._0=!1;e.fadeout&&this.fadeOut(e.fadeout);this.queue(function(){var b=d(this);b.hide();h(b,'closed',e);b.dequeue()})}},toggle:function(b,a){var e=typeof a=='boolean'?a:a&&a.doOpen!==p?a.doOpen:!b._0;s[e?'open':'close'].call(this,b,a)},isOpen:function(b){return!!(b||b._0)},isFickle:function(b){return!!b}},t={fickle:!0,closeOnEsc:!0,closeDelay:300},j=l+'-'+d.aquireId();d.fn.fickle=function(f,u){var k=this;if(typeof f=='string'){var n=s[f];if(n){return(/^is(Open|Fickle)$/.test(f))?n(k.data(j)):k.each(function(b,a){a=d(a);var e=a.data(j);e&&n.call(a,e,u)})}}else{f=d.beget(t,f);k.each(function(){var c=d(this);if(!c.data(j)){d.each(['Open','Opened','Close','Closed'],function(b,a){f['on'+a]&&c.on(l+a.toLowerCase(),f['on'+a])});var g={c:d.beget(f),_3:function(b){return(b.which!=27)||c.fickle('close')&&false},_2:function(b){var a=c[0];m=b.target!=a&&!d.contains(a,b.target)}},o;!f.startOpen&&c.hide();c.data(j,g).on('focusin focusout',function(b){g._1=b.type=='focusin'});if(f.fickle){c.on('focusout',function(b){var a=this;r();m=false;q=setTimeout(function(){f.trapFocus?d.focusHere(o):m&&d(a).fickle('close')},f.trapFocus?0:f.closeDelay)}).on('click mousedown focusin',function(a){setTimeout(r,0);if(a.type=='click'){var e=d(this);e.one('mouseleave',function(b){d.focusHere(o)})}else if(a.type=='focusin'){o=a.target}});if(document.body==c.closest('body')[0]){var v=d('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();if(v.index(this)>-1){d('body').append('<i tabindex="0" style="position:fixed;_4:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;"> </i>')}}}if(f.startOpen){c.fickle('open')}}})}return k}})(jQuery);