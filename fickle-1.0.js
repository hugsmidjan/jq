(function(c,s){var n=function(b,a,e){var f=c.Event(a);e&&c.extend(f,e);b.trigger(f);return!f.isDefaultPrevented()},h=document,g='fickle',o,i,p=function(b){clearTimeout(o)},j=function(){alert('method not implemented yet.')},q={open:function(b,a){var e=b.c;e.opener=(a&&a.opener)||e.opener;if(!b._0&&n(this,g+'open',{cfg:e})){e.fickle&&c(h).bind('focusin',b._1);e.closeOnEsc&&c(h).bind('keydown',b._2);b._0=!0;this.fadeIn(e.fadein||0).queue(function(){c(this).setFocus().trigger({type:g+'opened',cfg:e}).dequeue()})}},close:function(b){var a=b.c;if(!this.height()){this.height(1)}if(b._0&&n(this,g+'close',{cfg:a})){c(h).unbind('focusin',b._1).unbind('keydown',b._2);c.setFocus(a.opener||h.body);b._0=!1;this.fadeOut(a.fadeout||0).queue(function(){c(this).trigger({type:g+'closed',cfg:a}).dequeue()})}},toggle:function(b,a){var e=typeof a=='boolean'?a:a&&a.doOpen!==s?a.doOpen:!b._0;q[e?'open':'close'].call(this,b,a)},isOpen:function(b){return b._0},disable:j,enable:j,destroy:j},t={fickle:!0,focusTarget:'<a href="#" class="focustarget">.</a>',closeOnEsc:!0,closeDelay:300},k=g+'-'+c.aquireId();c.fn.fickle=function(d,u){if(typeof d=='string'){var l=q[d];if(l){return(d=='isOpen')?l(this.data(k)):this.each(function(b,a){a=c(a);l.call(a,a.data(k),u)})}}else{d=c.beget(t,d);var r=this;c.each(['Open','Opened','Close','Closed'],function(b,a){d['on'+a]&&r.bind(g+a.toLowerCase(),d['on'+a])});r.each(function(){var f=c(this),v={c:c.beget(d),_2:function(b){return(b.which!=27)||f.fickle('close')&&false},_1:function(b){var a=f[0];i=b.target!=a&&c(b.target).parents().index(a)==-1}},m;f.data(k,v).toggle(!!d.startOpen).prepend(d.focusTarget);if(d.fickle){f.bind('focusout',function(b){var a=this;p();i=false;o=setTimeout(function(){d.trapFocus?c.setFocus(m):i&&c(a).fickle('close')},d.trapFocus?d.closeDelay:0)}).bind('click mousedown focusin',function(a){setTimeout(p,0);if(a.type=='click'){var e=c(this);e.one('mouseleave',function(b){c.setFocus(m)})}else if(a.type=='focusin'){m=a.target}});if(document.body==f.closest('body')[0]){var w=c('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();if(w.index(this)>-1){c('body').append('<a href="#" style="position:fixed;_3:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>')}}}if(d.startOpen){f.fickle('open')}})}return this}})(jQuery);
