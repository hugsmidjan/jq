/* $.imgPopper 2.0  -- (c) 2017 Hugsmiðjan ehf.  @preserve */
!function(e){e.imgPopper={version:2,defaultConfig:{fadeInSpeed:250,fadeOutSpeed:200,marginTop:void 0,preloadImages:!0,ficle:{}},i18n:{en:{nextText:"Next",prevText:"Previous",closeText:"Close",imageText:"Image",ofTotalText:"of"},is:{nextText:"Næsta",prevText:"Fyrri",closeText:"Loka",imageText:"Mynd",ofTotalText:"af"}},imgTempl:'<div class="image"><span class="img"><img src="%{img}" alt="%{alt}" /></span><strong class="title">%{title}</strong><div class="desc">%{alt}</div></div>',pagingTempl:'<div class="status"><strong>%{imageText}</strong> <span><b class="count">%{num}</b> %{ofTotalText} %{total}</span></div><ul class="stepper"><li class="next"><a href="#">%{nextText}</a></li><li class="prev"><a href="#">%{prevText}</a></li></ul>',getImage:function(t){return e.inject(this.imgTempl,{img:t.attr("href"),alt:t.find("img").attr("alt")||"",title:t.find("img").attr("title")||""})}},e.fn.imgPopper=function(t){var i,n,a,l=e.imgPopper.i18n,p=this,g=e('<div class="paging" />'),o=e('<div class="imgwrap" />'),r=function(e,t,i){e.find("li.prev").toggleClass("nav-end",!t),e.find("li.next").toggleClass("nav-end",t===i-1),e.find("b").text(t+1)};return l=l[e.lang()]||l.en,t=e.extend({},e.imgPopper.defaultConfig,l,t),p.on("click",function(l){l.preventDefault(),n=e(this),i=p.index(n),g.empty().append(e.inject(e.imgPopper.pagingTempl,{imageText:t.imageText,ofTotalText:t.ofTotalText,nextText:t.nextText,prevText:t.prevText,total:p.length,num:i+1})),r(g,i,p.length),o.empty().append(e.imgPopper.getImage(p.eq(i))).append(g),a=e.getModal({opener:n,className:"imgpopper",marginTop:t.marginTop,content:o,fickle:e.extend({fadein:t.fadeInSpeed,fadeout:t.fadeOutSpeed,onClosed:function(){e(window).off("keyup.imgpopper"),e(this).remove()}},t.fickle)}).fickle("open"),e(window).on("keyup.imgpopper",function(e){37===e.which?g.find(".prev").trigger("click"):39===e.which&&g.find(".next").trigger("click")}),g.on("click","li",function(n){n.preventDefault();var a=e(this);if(!a.is(".nav-end")){var l=a.is(".next")?1:-1;i=Math.min(Math.max(0,i+l),p.length-1),o.find(".image").replaceWith(e.imgPopper.getImage(p.eq(i))),r(g,i,p.length),t.preloadImages&&(0!==i&&((new Image).src=p[i-1].href),i!==p.length-1&&((new Image).src=p[i+1].href))}})}),this}}(jQuery);
