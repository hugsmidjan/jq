(function(b){var l=function(a,c,e){var f=b.extend(b.Event(c),e||{});a.trigger(f);return!f.isDefaultPrevented()},g=document,m,h,n=function(a){clearTimeout(m)},i=function(){alert('method not implemented yet.')},o={open:function(a,c){var e=a.c;e.opener=(c&&c.opener)||e.opener;if(l(this,'popupopen',{cfg:e})){this.queue(function(){b(this).show().setFocus().dequeue()});b(g).bind('focusin',a._0);e.closeOnEsc&&b(g).bind('keydown',a._1);a._2=!1;this.trigger({type:'popupopened',cfg:e})}},close:function(a){var c=a.c;if(l(this,'popupclose',{cfg:c})){b(g).unbind('keydown',a._1);b(g).unbind('focusin',a._0);b(c.opener||g.body).setFocus();this.queue(function(){b(this).hide().dequeue()});a._2=!0;this.trigger({type:'popupclosed',cfg:c})}},isOpen:function(a){return a._2},disable:i,enable:i,destroy:i},p={activeClass:'fickle-active',closeOnEsc:true,closeDelay:300,focusTarget:'<a href="#" class="focustarget">.</a>'},j='fickle-'+b.aquireId();b.fn.fickle=function(d,q){if(typeof d=='string'){var k=o[d];if(k){return(d=='isOpen')?k(this.data(j)):this.each(function(){var a=b(this);k.call(a,a.data(j),q)})}}else{d=b.beget(p,d);this.each(function(){var f=b(this),r={c:b.beget(d),_1:function(a){return(a.which!=27)||f.fickle('close')&&false},_0:function(a){var c=f[0];h=a.target!=c&&b(a.target).parents().index(c)==-1}};f.data(j,r).toggle(d.startOpen).addClass(d.activeClass).prepend(d.focusTarget).bind('focusout',function(a){var c=this;n();h=false;m=setTimeout(function(){h&&b(c).fickle('close')},d.closeDelay)}).bind('click mousedown focusin',function(c){setTimeout(n,0);if(c.type=='click'){var e=b(this);e.one('mouseleave',function(a){e.setFocus()})}});if(document.body==f.closest('body')[0]){var s=b('a,input,select,textarea,button,object,area').filter(':last').parents().andSelf();if(s.index(this)>-1){b('body').append('<a href="#" style="position:fixed;_3:absolute;left:-9999px;overflow:hidden;width:1px;height:1px;">.</a>')}}if(d.startOpen){f.fickle('open')}})}return this}})(jQuery);
