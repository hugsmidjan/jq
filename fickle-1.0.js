(function(b){var m=function(a,c,e){var f=b.extend(b.Event(c),e||{});a.trigger(f);return!f.isDefaultPrevented()},h=document,g='fickle',n,i,o=function(a){clearTimeout(n)},j=function(){alert('method not implemented yet.')},q={open:function(a,c){var e=a.c;e.opener=(c&&c.opener)||e.opener;if(m(this,g+'open',{cfg:e})){b(h).bind('focusin',a._0);e.closeOnEsc&&b(h).bind('keydown',a._1);a._2=!1;this.queue(function(){b(this).fadeIn(e.fadein||0).setFocus().dequeue().trigger({type:g+'opened',cfg:e})})}},close:function(a){var c=a.c;if(m(this,g+'close',{cfg:c})){b(h).unbind('keydown',a._1);b(h).unbind('focusin',a._0);b(c.opener||h.body).setFocus();a._2=!0;this.queue(function(){b(this).fadeOut(c.fadeout||0).dequeue().trigger({type:g+'closed',cfg:c})})}},isOpen:function(a){return a._2},disable:j,enable:j,destroy:j},r={focusTarget:'<a href="#" class="focustarget">.</a>',activeClass:g+'-active',closeOnEsc:true,closeDelay:300},k=g+'-'+b.aquireId();b.fn.fickle=function(d,s){if(typeof d=='string'){var l=q[d];if(l){return(d=='isOpen')?l(this.data(k)):this.each(function(){var a=b(this);l.call(a,a.data(k),s)})}}else{d=b.beget(r,d);var p=this;p.each(function(){var f=b(this),t={c:b.beget(d),_1:function(a){return(a.which!=27)||f.fickle('close')&&false},_0:function(a){var c=f[0];i=a.target!=c&&b(a.target).parents().index(c)==-1}};f.data(k,t).toggle(!!d.startOpen).addClass(d.activeClass).prepend(d.focusTarget).bind('focusout',function(a){var c=this;o();i=false;n=setTimeout(function(){i&&b(c).fickle('close')},d.closeDelay)}).bind('click mousedown focusin',function(c){setTimeout(o,0);if(c.type=='click'){var e=b(this);e.one('mouseleave',function(a){e.setFocus()})}});if(document.body==f.closest('body')[0]){var u=b('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();if(u.index(this)>-1){b('body').append('<a href="#" style="position:fixed;_3:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>')}}if(d.startOpen){f.fickle('open')}});b.each(['Open','Opened','Close','Closed'],function(a,c){d['on'+c]&&p.bind(g+c.toLowerCase(),d['on'+c])})}return this}})(jQuery);
