(function($){$.fn.imgPopper=function(b){b=$.extend({fadeInSpeed:250,fadeOutSpeed:250,disableIeFading:0,setContainerWidth:0,curtainColor:'#000000',curtainOpacity:'0.7',easeIn:'swing',easeOut:'swing',imgClose:false},b);var c='li.next, li.prev',_closeSelectors='div.ipopup-container li.close a, div.ipopup-curtain, div.ipopup-container',_isOpen=false,_ypos=0,_hrefElms=this,_langIs=$('html').attr('lang')=='is',_nextText=_langIs?'N�sta':'Next',_prevText=_langIs?'Fyrri':'Previous',_closeText=_langIs?'Loka':'Close',_imageText=_langIs?'Mynd':'Image',_ofTotalText=_langIs?'af':'of',_curtainTemp='<div class="ipopup-curtain"></div>',_popupTemp='<div class="ipopup-container">'+'<div class="ipopup-container-wrapper">'+'<a class="focustarget" style="position:absolute;left:auto;right:9999px;" href="#">.</a>'+'<div class="image">'+'<span class="img"><img src="%{img}" alt="%{alt}" /></span>'+'<strong class="title">%{title}</strong>'+'<div class="desc">%{alt}</div>'+'</div>'+'<div class="paging">'+'<div class="status">'+'<strong>'+_imageText+'</strong> '+'<span><b>%{num}</b> '+_ofTotalText+' %{total}</span>'+'</div>'+'<ul class="stepper">'+'<li class="next"><a href="#">'+_nextText+'</a></li>'+'<li class="prev"><a href="#">'+_prevText+'</a></li>'+'<li class="close"><a href="#">'+_closeText+'</a></small></li>'+'</ul>'+'</div>'+'</div>'+'</div>';if(b.disableIeFading&&$.browser.msie&&parseInt($.browser.version,10)<9){b.fadeInSpeed=0;b.fadeOutSpeed=0};_hrefElms.bind('click',function(e){var i=_hrefElms.index(this),_img=$('img',this)[0],_makeHTML=$.inject(_popupTemp,{img:$(this).attr('href'),title:_img.title,alt:_img.alt,num:i+1,total:_hrefElms.length}),_popup=$(_makeHTML),_curtain=$(_curtainTemp),setWidth=function(){if(b.setContainerWidth){var a=_popup.find('img');a.each(function(){$(this).bind('load readystatechange',function(){_popup.find('div.ipopup-container-wrapper').css('width',a.outerWidth())});this.src+=''})}};$('body').append(_curtain).append(_popup);_popup.hide();if(!_isOpen){_ypos=$(document).scrollTop();_curtain.css({'background-color':b.curtainColor,opacity:'0','display':'block'}).animate({opacity:b.curtainOpacity},b.fadeInSpeed,b.easeIn,function(){_popup.css('top',_ypos).fadeIn(b.fadeInSpeed,b.easeIn).find('div.ipopup-container-wrapper').bind('click',function(e){if(!b.imgClose){e.stopPropagation()}}).setFocus();setWidth()});_isOpen=true}else{_curtain.css({'background-color':b.curtainColor,opacity:b.curtainOpacity}).show();_popup.css('top',_ypos).show();setWidth()}$(c,_popup).each(function(j){var a=i+(j?-1:1);if(a<0||a>=_hrefElms.length){$(this).addClass('nav-end').find('a').removeAttr('href')}else{$(this).bind('click',function(e){_curtain.remove();_popup.remove();_hrefElms.eq(a).trigger('click');return false})}});$(_closeSelectors).bind('click',function(e){_popup.fadeOut(b.fadeOutSpeed,function(){_curtain.fadeOut(b.fadeOutSpeed,function(){_popup.remove();_curtain.remove();_hrefElms.focus()},b.easeOut)},b.easeOut);_isOpen=false;return false});$(window).keypress(function(e){if(e.keyCode==27){_curtain.trigger('click')}});return false});return this}})(jQuery);
