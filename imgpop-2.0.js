// $.fn.imgPopper 2.0  -- (c) 2012 Hugsmiðjan ehf.
(function(a){a.imgPopper={version:2.0,defaultConfig:{fadeInSpeed:250,fadeOutSpeed:200},i18n:{en:{nextText:'Next',prevText:'Previous',closeText:'Close',imageText:'Image',ofTotalText:'of'},is:{nextText:'Næsta',prevText:'Fyrri',closeText:'Loka',imageText:'Mynd',ofTotalText:'af'}},imgTempl:'<div class="image"><span class="img"><img src="%{img}" alt="%{alt}" /></span><strong class="title">%{title}</strong><div class="desc">%{alt}</div></div>',pagingTempl:'<div class="status"><strong>%{imageText}</strong> <span><b class="count">%{num}</b> %{ofTotalText} %{total}</span></div><ul class="stepper"><li class="next"><a href="#">%{nextText}</a></li><li class="prev"><a href="#">%{prevText}</a></li></ul>'};var l=function(e,d){var b=e.eq(d),g=a('<img />');if(d!=0){g.attr('src',e.eq(d-1).attr('href'))}else if(d!=e.length-1){g.attr('src',e.eq(d+1).attr('href'))}return a.inject(a.imgPopper.imgTempl,{img:b.attr('href'),alt:b.find('img').attr('alt')||'',title:b.find('img').attr('title')||''})},m=function(e,d,b){b.find('.nav-end').removeClass('nav-end');if(e==0){b.find('.prev').addClass('nav-end')}else if(e==d-1){b.find('.next').addClass('nav-end')}b.find('.count').text(e+1)};a.fn.imgPopper=function(b){var g=a.imgPopper.i18n,f=this,c,i,j,h=a('<div class="paging" />'),k=a('<div class="imgwrap" />');g=g[a.lang()]||g.en;b=a.extend({},a.imgPopper.defaultConfig,g,b);f.on('click',function(d){i=a(this);c=f.index(i);h.empty().append(a.inject(a.imgPopper.pagingTempl,{imageText:b.imageText,ofTotalText:b.ofTotalText,nextText:b.nextText,prevText:b.prevText,total:f.length,num:c+1}));m(c,f.length,h);k.empty().append(l(f,c)).append(h);j=a.getModal({opener:i,content:k,fickle:{fadein:b.fadeInSpeed,fadeout:b.fadeOutSpeed}});j.addClass('imgpopper').fickle('open');h.delegate('li','click',function(e){if(a(this).is('.next')){c=c!=f.length-1?c+1:c}else{c=c!=0?c-1:c}m(c,f.length,h);k.find('.image').replaceWith(l(f,c));e.preventDefault()});d.preventDefault()});var n=function(e){var d=e.which;if(d==27){j.fickle('close')}if(d==37){h.find('.prev').trigger('click')}if(d==39){h.find('.next').trigger('click')}};a(window).on('keyup',n);return this}})(jQuery);