(function(c){c.fn.mediaPlayer=function(a){a=jQuery.extend({width:125,playerHTML:'<span class="epmediaplayer"><embed src="%{player}" width="%{width}" height="20" allowscriptaccess="always" allowfullscreen="true" flashvars=playlist=none&amp;height=20&amp;autostart=true" /></span>',playerUrl:(document.location.protocol=='https:'?'https://secure.eplica.is/codecentre':'http://codecentre.eplica.is')+'/play/audio.swf?file=%{file}',},a);return this.each(function(){var d=this,f=d.href.split('?')[0],b;if(/\.(mp3|aac)$/.test(f)){c(d).toggle(function(e){e.preventDefault();if(b){b.remove()}b=c(a.playerHTML.replace('%{width}',a.width).replace('%{player}',a.playerUrl).replace('%{file}',f));if(a.placeholder){c(a.placeholder).append(b)}else{c(d).after(b)}},function(e){e.preventDefault();b.remove();b=0})}})}})(jQuery);