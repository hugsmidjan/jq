// (c) Yereth Jansen (yereth@yereth.nl) - GPL & MIT
;(function($){$.ifixpng=function(a){$.ifixpng.pixel=a};$.ifixpng.regexp={bg:/^url\(["']?(.*\.png([?].*)?)["']?\)$/i,img:/.*\.png([?].*)?$/i},$.ifixpng.getPixel=function(){return $.ifixpng.pixel||"https://secure.eplica.is/codecentre/f/trans.png"};var g={base:$('base').attr('href'),ltie7:$.browser.msie&&$.browser.version<7,filter:function(a){return"progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=crop,src='"+a+"')"}};$.fn.ifixpng=g.ltie7?function(){function fixImage(b,c,d,e,f){b.css({filter:g.filter(c),width:d,height:e}).attr({src:$.ifixpng.getPixel()}).each(function(){var a=$(this);if(a.css('position')!='absolute')a.css({position:'relative'})})}return this.each(function(){var a=$(this);if(a.is('img')||a.is('input')){var b,img;if(this.src&&this.src.match($.ifixpng.regexp.img)){b=(g.base&&this.src.substring(0,1)!='/'&&this.src.indexOf(g.base)===-1)?g.base+this.src:this.src;if(!this.width||!this.height){$(new Image()).one('load',function(){fixImage(a,b,this.width,this.height);$(this).remove()}).attr('src',b)}else fixImage(a,b,this.width,this.height)}}})}:function(){return this}})(jQuery);