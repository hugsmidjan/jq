// encoding: utf-8
// $.fn.imgPopper 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function($){$.fn.imgPopper=function(d){d=$.extend({fadeInSpeed:250,fadeOutSpeed:200,imgFadeSpeed:false,disableIeFading:0,setContainerWidth:0,curtainColor:'#000000',curtainOpacity:'0.7',easeIn:'swing',easeOut:'swing',yOffset:0,imgClose:false},d);var f='li.next, li.prev',_closeSelectors='div.ipopup-container li.close a, div.ipopup-curtain, div.ipopup-container',_isOpen=false,_hrefElms=this,_ypos,_langIs=$('html').attr('lang')=='is',_nextText=_langIs?'Næsta':'Next',_prevText=_langIs?'Fyrri':'Previous',_closeText=_langIs?'Loka':'Close',_imageText=_langIs?'Mynd':'Image',_ofTotalText=_langIs?'af':'of',_curtainTemp='<div class="ipopup-curtain"></div>',_popupTemp='<div class="ipopup-container">'+'<div class="ipopup-container-wrapper">'+'<a class="focustarget" style="position:absolute;left:auto;right:9999px;" href="#">.</a>'+'<div class="image">'+'<span class="img"><img src="%{img}" alt="%{alt}" /></span>'+'<strong class="title">%{title}</strong>'+'<div class="desc">%{alt}</div>'+'</div>'+'<div class="paging">'+'<div class="status">'+'<strong>'+_imageText+'</strong> '+'<span><b>%{num}</b> '+_ofTotalText+' %{total}</span>'+'</div>'+'<ul class="stepper">'+'<li class="next"><a href="#">'+_nextText+'</a></li>'+'<li class="prev"><a href="#">'+_prevText+'</a></li>'+'<li class="close"><a href="#">'+_closeText+'</a></small></li>'+'</ul>'+'</div>'+'</div>'+'</div>';if(d.disableIeFading&&$.browser.msie&&parseInt($.browser.version,10)<9){d.fadeInSpeed=0;d.fadeOutSpeed=0};var g=$(_curtainTemp).hide();_hrefElms.bind('click',function(e){var i=_hrefElms.index(this),_img=$(this).find('img').length?$('img',this)[0]:'',_makeHTML=$.inject(_popupTemp,{img:$(this).attr('href'),title:_img.title||'',alt:_img.alt||'',num:i+1,total:_hrefElms.length}),_popup=$(_makeHTML).hide(),setWidth=function(){var a=_popup.find('img');a.each(function(){$(this).bind('load readystatechange',function(){_popup.find('div.ipopup-container-wrapper').css('width',a.outerWidth())});this.src+=''})};if(!_isOpen){$('body').append(g).append(_popup);_ypos=$(document).scrollTop()+d.yOffset;g.css({'background-color':d.curtainColor,opacity:'0','display':'block'}).animate({opacity:d.curtainOpacity},(d.fadeInSpeed/2),d.easeIn,function(){_popup.css('top',_ypos).fadeIn(d.fadeInSpeed,d.easeIn).find('div.ipopup-container-wrapper').bind('click',function(e){if(!d.imgClose){e.stopPropagation()}}).setFocus();if(d.setContainerWidth){setWidth()}});_isOpen=true}else{$('body').append(_popup);_popup.css('top',_ypos).find('img').hide().fadeIn(d.imgFadeSpeed||d.fadeInSpeed).end().show().find('div.ipopup-container-wrapper').bind('click',function(e){if(!d.imgClose){e.stopPropagation()}});if(d.setContainerWidth){setWidth()}}$(f,_popup).each(function(j){var a=i+(j?-1:1);if(a<0||a>=_hrefElms.length){$(this).addClass('nav-end').find('a').removeAttr('href')}else{$(this).bind('click',function(e){_popup.remove();$(window).unbind('keyup',c);_hrefElms.eq(a).trigger('click');return false})}});$(_closeSelectors).bind('click',function(e){_popup.fadeOut(d.fadeOutSpeed,function(){g.fadeOut(d.fadeOutSpeed,function(){$('body > div.ipopup-curtain, body > div.ipopup-container').remove();$(window).unbind('keyup',c);_hrefElms.focus()},d.easeOut)},d.easeOut);_isOpen=false;return false});var c=function(e){if(e.keyCode==27){g.trigger('click')}if(e.keyCode==37){var a=$('.paging .prev',_popup);a.is('.nav-end')?g.trigger('click'):a.trigger('click')}if(e.keyCode==39){var b=$('.paging .next',_popup);b.is('.nav-end')?g.trigger('click'):b.trigger('click')}};$(window).bind('keyup',c);return false});return this}})(jQuery);
