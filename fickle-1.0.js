// encoding: utf-8
// $.fn.fickle 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(d,o){var g=function(b,a,e){var c=d.Event(k+a);c.cfg=e;c.stopPropagation();b.trigger(c);return!c.isDefaultPrevented()},h=document,k='fickle',p,l,q=function(b){clearTimeout(p)},r={open:function(a,e){var c=a.c;c.opener=(e&&e.opener)||c.opener;if(!a._0&&g(this,'open',c)){a._1=o;c.fickle&&d(h).bind('focusin click',a._2);c.closeOnEsc&&d(h).bind('keydown',a._3);a._0=!0;c.fadein&&this.fadeIn(c.fadein);this.queue(function(){var b=d(this);b.unhide();g(b,'opened',c);a._1||b.setFocus();b.dequeue()})}},close:function(a){var e=a.c;if(!this.height()){this.height(1)}if(a._0&&g(this,'close',e)){d(h).unbind('focusin click',a._2).unbind('keydown',a._3);d.setFocus(e.opener||h.body);a._0=!1;e.fadeout&&this.fadeOut(e.fadeout);this.queue(function(){var b=d(this);b.hide();g(b,'closed',e);b.dequeue()})}},toggle:function(b,a){var e=typeof a=='boolean'?a:a&&a.doOpen!==o?a.doOpen:!b._0;r[e?'open':'close'].call(this,b,a)},isOpen:function(b){return!!(b||b._0)},isFickle:function(b){return!!b},config:function(b){return b.c}},t={fickle:!0,focusTarget:'<a href="#" class="focustarget">.</a>',closeOnEsc:!0,closeDelay:300},i=k+'-'+d.aquireId();d.fn.fickle=function(f,u){var j=this;if(typeof f=='string'){var m=r[f];if(m){return(/^is(Open|Fickle)$/.test(f))?m(j.data(i)):j.each(function(b,a){a=d(a);var e=a.data(i);e&&m.call(a,e,u)})}}else{f=d.beget(t,f);j.each(function(){var c=d(this);if(!c.data(i)){d.each(['Open','Opened','Close','Closed'],function(b,a){f['on'+a]&&c.bind(k+a.toLowerCase(),f['on'+a])});var s={c:d.beget(f),_3:function(b){return(b.which!=27)||c.fickle('close')&&false},_2:function(b){var a=c[0];l=b.target!=a&&d(b.target).parents().index(a)==-1}},n;!f.startOpen&&c.hide();c.data(i,s).prepend(f.focusTarget).bind('focusin focusout',function(b){s._1=b.type=='focusin'});if(f.fickle){c.bind('focusout',function(b){var a=this;q();l=false;p=setTimeout(function(){f.trapFocus?d.setFocus(n):l&&d(a).fickle('close')},f.trapFocus?0:f.closeDelay)}).bind('click mousedown focusin',function(a){setTimeout(q,0);if(a.type=='click'){var e=d(this);e.one('mouseleave',function(b){d.setFocus(n)})}else if(a.type=='focusin'){n=a.target}});if(document.body==c.closest('body')[0]){var v=d('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();if(v.index(this)>-1){d('body').append('<a href="#" style="position:fixed;_4:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>')}}}if(f.startOpen){c.fickle('open')}}})}return j}})(jQuery);
