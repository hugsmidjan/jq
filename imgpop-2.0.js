// $.fn.imgPopper 2.0  -- (c) 2012 Hugsmiðjan ehf.
(function(a){a.imgPopper={version:2.0,defaultConfig:{fadeInSpeed:250,fadeOutSpeed:200},i18n:{en:{nextText:'Next',prevText:'Previous',closeText:'Close',imageText:'Image',ofTotalText:'of'},is:{nextText:'Næsta',prevText:'Fyrri',closeText:'Loka',imageText:'Mynd',ofTotalText:'af'}},imgTempl:'<div class="image"><span class="img"><img src="%{img}" alt="%{alt}" /></span><strong class="title">%{title}</strong><div class="desc">%{alt}</div></div>',pagingTempl:'<div class="status"><strong>%{imageText}</strong> <span><b class="count">%{num}</b> %{ofTotalText} %{total}</span></div><ul class="stepper"><li class="next"><a href="#">%{nextText}</a></li><li class="prev"><a href="#">%{prevText}</a></li></ul>',getImage:function(b){return a.inject(this.imgTempl,{img:b.attr('href'),alt:b.find('img').attr('alt')||'',title:b.find('img').attr('title')||''})}};a.fn.imgPopper=function(e){var h=a.imgPopper.i18n,d=this,c,i,l,f=a('<div class="paging" />'),j=a('<div class="imgwrap" />')_0=function(b,g,k){b.find('li.prev').toggleClass('nav-end',!g);b.find('li.next').toggleClass('nav-end',g===k-1);b.find('b').text(g+1)};h=h[a.lang()]||h.en;e=a.extend({},a.imgPopper.defaultConfig,h,e);d.on('click',function(m){i=a(this);c=d.index(i);f.empty().append(a.inject(a.imgPopper.pagingTempl,{imageText:e.imageText,ofTotalText:e.ofTotalText,nextText:e.nextText,prevText:e.prevText,total:d.length,num:c+1}));_0(f,c,d.length);j.empty().append(a.imgPopper.getImage(d.eq(c))).append(f);l=a.getModal({opener:i,className:'imgpopper',content:j,fickle:{fadein:e.fadeInSpeed,fadeout:e.fadeOutSpeed,onClosed:function(){a(window).off('keyup.imgpopper');a(this).remove()}}}).fickle('open');a(window).on('keyup.imgpopper',function(b){b.which===37?f.find('.prev').trigger('click'):b.which===39?f.find('.next').trigger('click'):null});f.delegate('li','click',function(b){var g=a(this);if(!g.is('.nav-end')){var k=g.is('.next')?1:-1;c=Math.min(Math.max(0,c+k),d.length-1);j.find('.image').replaceWith(a.imgPopper.getImage(d.eq(c)));_0(f,c,d.length);if(!c){(new Image()).src=d[c-1].href}if(c===d.length-1){(new Image()).src=d[c+1].href}}b.preventDefault()});m.preventDefault()});return this}})(jQuery);
