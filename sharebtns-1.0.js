// $.fn.sharebtns 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(c,t,m,p){var q=c.fn.sharebtns=function(h){var j=[];if(this.length){h=c.extend(true,{},u,h);c.each(l,function(f,v){var k=h[f];if(k){var d=h[f]=c.extend({},v,k);c.each(w,function(a,b){b=b[f];h[a]&&b&&c.extend(d,b)});d.url=d.url||h.url;c.extend(d,k);d.$pos=typeof k==='number'?k:d.$pos||0;d.$prep&&d.$prep(h);var i=d.$tmpl.replace(/(%=?)?\{(.+?)\}/g,function(a,b,e){var g=d[e];return!b?g:b==='%'?m(g):g?e+'='+m(g)+'&':''});i=c(h.process?h.process(i,f,d):i);i.$pos=d.$pos;j.push(i);d.$init&&setTimeout(function(){d.$init(i,h)},0)}});j=c.map(j.sort(function(a,b){var e=a.$pos-b.$pos;return e>0?1:e<0?-1:0}),function(a){return a.toArray()});this[h.insertion](j)}return this.pushStack(j)},u=q.defaults={twitter:true,facebook:true,insertion:'append',url:t.href.split('#')[0]},n={count:'none'},r={count:'vertical'},w={large:{twitter:{size:'l'},facebook:{},gplus:{size:''},pinterest:{}},countNone:{twitter:n,facebook:{count:'standard'},gplus:n,pinterest:n},countV:{twitter:r,facebook:{count:'box_count'},gplus:{count:'',size:'tall'},pinterest:r}},l=q.btnDefaults={twitter:{size:'m',count:'',via:'',related:'',lang:'',hashtags:'',text:'',$prep:function(){var a=this,b=!a.count||a.count==='horizontal',e=a.count==='vertical',g=a.size==='l';a.width=(b&&g)?'138px':b?'110px':g?'76px':'58px';a.height=g?'28px':e?'62px':'20px'},$tmpl:'<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',$pos:10},fbshare:{color:'',$prep:function(){var a=this;a.width='5.636em';a.height='1.818em';a.$prep2()},$prep2:function(){var a=this,b={en:'Share',is:'Deila'};if(!a.txt){a.lang=c('html').attr('lang').substr(0,2);a.txt=b[a.lang];if(!a.txt){a.lang='en';a.txt=b.en}}},$lnk:'<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="fbshare" href="//www.facebook.com/sharer.php?u=',$init:function(a){var b=this,e=a.find('iframe').andSelf().filter('iframe').first().contents()[0];e.write('<!DOCTYPE html><html lang="'+b.lang+'"><head><meta charset="UTF-8" /><title>.</title><link href="https://codecentre.eplica.is/f/fb-share.css" rel="stylesheet" type="text/css" /></head><body class="'+(b.color||'')+'">'+b.$lnk+m(b.url)+'">'+b.txt+'</a></body></html>');e.close()},$tmpl:'<iframe style="width:{width};height:{height};font-size:11px;" allowtransparency="true" frameborder="0" scrolling="no" />',$pos:40},facebook:{width:null,count:'button_count',sendBtn:false,faces:false,color:'',verb:'',$prep:function(){var a=this;a.width=a.width||(a.count==='box_count'?85:120)},$tmpl:'<div class="fb-like" data-send="{sendBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-colorscheme="{color}" data-href="{url}" />',$init:function(){if(!c('#fb-root')[0]){c('body').prepend('<div id="fb-root"/>')}o('//connect.facebook.net/'+this.$locale()+'/all.js#xfbml=1',function(){window.FB&&FB.XFBML.parse()})},$loc:'',$locs:{is:'is_IS',dk:'dk_DK',pl:'pl_PL',fo:'fo_FO',no:'nn_NO',se:'sv_SE',de:'de_DE'},$locale:function(){this.$loc=this.$loc||this.$locs[c('html').attr('lang').substr(0,2)]||'en_US';return this.$loc},$pos:50},gplus:{count:'',size:'medium',$tmpl:'<div class="g-plusone" data-size="{size}" data-annotation="{count}" data-href="{url}"/>',$init:function(){o('//apis.google.com/js/plusone.js',function(){window.gapi&&gapi.plusone.go()})},$pos:20},pinterest:{imgsrc:'',count:'',imgSelector:'.pgmain img',$tmpl:'<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" count-layout="{count}" lang="en">Pin It</a>',$prep:function(){var a=this;if(!a.imgsrc){a.imgsrc=(a.imgSelector&&c(a.imgSelector).attr(a.imgSrcAttr||'src'))||c('meta[property="og:image"]').attr('content')||c('img').attr('src')}},$init:function(){o('https://assets.pinterest.com/js/pinit.js')},$pos:30}},s={},o=function(e,g){var f=s[e];if(!f){s[e]=f={};c('<script/>').attr('src',e).each(function(){c('head')[0].appendChild(this)}).on(p,function(a){var b=this;if(!b.readyState||/^(loaded|complete)$/.test(b.readyState)){f.loaded=1;if(g){clearTimeout(f.timeout);f.timeout=setTimeout(g,100)}c(b).off(p)}})}else if(g&&f.loaded){clearTimeout(f.timeout);f.timeout=setTimeout(g,100)}};l.fbshare2={url:'',$prep:function(){l.fbshare.$prep2.call(this)},$tmpl:l.fbshare.$lnk+'%{url}" class="fbsharebtn">{txt}</a>',$pos:40}})(jQuery,document.location,encodeURIComponent,'load readystatechange');
