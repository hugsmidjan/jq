/* $.imgPopper 2.0  -- (c) 2017 Hugsmiðjan ehf.  @preserve */
!function(s){s.imgPopper={version:2,defaultConfig:{modalClass:"imgpopper",fadeInSpeed:250,fadeOutSpeed:200,marginTop:void 0,preloadImages:!0,ficle:{}},i18n:{en:{nextText:"Next",prevText:"Previous",closeText:"Close",imageText:"Image",ofTotalText:"of"},is:{nextText:"Næsta",prevText:"Fyrri",closeText:"Loka",imageText:"Mynd",ofTotalText:"af"}},imgTempl:'<div class="image"><span class="img"><img src="%{img}" alt="%{alt}" /></span><strong class="title">%{title}</strong><div class="desc">%{alt}</div></div>',pagingTempl:'<div class="status"><strong>%{imageText}</strong> <span><b class="count">%{num}</b> %{ofTotalText} %{total}</span></div><ul class="stepper"><li class="next"><a href="#">%{nextText}</a></li><li class="prev"><a href="#">%{prevText}</a></li></ul>',getImage:function(e){return s.inject(this.imgTempl,{img:e.attr("href"),alt:e.find("img").attr("alt")||e.find("ins.image").data("alt")||"",title:e.find("img").attr("title")||e.find("ins.image").data("title")||""})}},s.fn.imgPopper=function(a){var e=s.imgPopper.i18n;e=e[s.lang()]||e.en,a=s.extend({},s.imgPopper.defaultConfig,e,a);var l,n,o=this,p=function(e,t,i){e.find("li.prev").toggleClass("nav-end",!t),e.find("li.next").toggleClass("nav-end",t===i-1),e.find("b").text(t+1)},g=function(e,t,i){var n=Math.min(Math.max(0,t+i),o.length-1);n!==t&&(l=n,e.find(".image").replaceWith(s.imgPopper.getImage(o.eq(l))),p(e.find(".paging"),l,o.length),a.preloadImages&&(0!==l&&((new Image).src=o[l-1].href),l!==o.length-1&&((new Image).src=o[l+1].href)))};return o.on("click",function(e){e.preventDefault(),n=s(this),l=o.index(n);var t=s('<div class="paging" />'),i=s('<div class="imgwrap" />');t.empty().append(s.inject(s.imgPopper.pagingTempl,{imageText:a.imageText,ofTotalText:a.ofTotalText,nextText:a.nextText,prevText:a.prevText,total:o.length,num:l+1})),p(t,l,o.length),i.empty().append(s.imgPopper.getImage(o.eq(l))).append(t).hammer().on("swipeleft",function(){g(i,l,1)}).on("swiperight",function(){g(i,l,-1)}),s.getModal({opener:n,className:a.modalClass,marginTop:a.marginTop,content:i,fickle:s.extend({fadein:a.fadeInSpeed,fadeout:a.fadeOutSpeed,onClosed:function(){s(window).off("keyup.imgpopper"),s(this).remove()}},a.fickle)}).fickle("open"),s(window).on("keyup.imgpopper",function(e){var t=37===e.which?-1:39===e.which?1:0;g(i,l,t)}),t.on("click","li",function(e){e.preventDefault();var t=s(this).is(".next")?1:-1;g(i,l,t)})}),this}}(jQuery);
