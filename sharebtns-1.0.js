// $.fn.sharebtns 1.0  -- (c) 2012 Hugsmiðjan ehf.
(function(t,e,n,o,a){var i,r=t.fn.sharebtns=function(e){i=i||t("html").attr("lang").substr(0,2)||"en";var n=[];if(this.length){e=t.extend(true,{},s,e);t.each(u,function(a,r){var s=e[a];if(s){var c=e[a]=t.extend({custom:e.custom,url:e.url,lang:i},r);t.each(l,function(n,o){o=o[a];e[n]&&o&&t.extend(c,o)});t.extend(c,s);c.$pos=typeof s==="number"?s:c.$pos||0;c.$prep&&c.$prep(e);var u=c.$tmpl.replace(/(%=?)?\{(.+?)\}/g,function(t,e,n){var a=c[n];return!e?a:e==="%"?o(a):a!=null?n+"="+o(a)+"&amp;":""});if(e.wrap){u="<"+e.wrap+" class="+a+">"+u+"</"+e.wrap+">"}u=t(e.process?e.process(u,a,c):u);u.$pos=c.$pos;n.push(u);!c.custom&&c.$init&&setTimeout(function(){c.$init(u,e)},0)}});n=t.map(n.sort(function(t,e){var n=t.$pos-e.$pos;return n>0?1:n<0?-1:0}),function(t){return t.toArray()});this[e.insertion](n)}return this.pushStack(n)},s=r.defaults={twitter:true,facebook:true,insertion:"append",url:t('link[rel="canonical"]').prop("href")||n.href.split("#")[0].replace(/[?&]fb_action_ids=.+/,"")},c={count:"none"},l={dark:{fbshare:{color:"dark"},facebook:{color:"dark"}},large:{twitter:{size:"l"},facebook:{},gplus:{size:""},pinterest:{}},countNone:{twitter:c,facebook:{count:"standard"},gplus:c,pinterest:c},countV:{twitter:{count:"vertical"},facebook:{count:"box_count"},gplus:{count:"",size:"tall"},pinterest:{count:"above"}}},u=r.btnDefaults={twitter:{size:"m",count:"",via:"",related:"",hashtags:"",text:"",$prep:function(){var t=this;if(t.custom){var e={en:"Tweet this!",is:"Senda á Twitter"};t.txt=t.txt||e[t.lang]||e.en;t.$tmpl='<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="tweetit"'+' href="https://twitter.com/intent/tweet?%={via}%={related}%={hashtags}%={text}%={url}%={lang}"'+">{txt}</a>"}else{var n=!t.count||t.count==="horizontal",o=t.count==="vertical",a=t.size==="l";t.width=n&&a?"138px":n?"110px":a?"76px":"58px";t.height=a?"28px":o?"62px":"20px"}},$tmpl:'<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',$pos:10},fbshare:{color:"",$prep:function(){var t=this;if(!t.txt){var e={en:"Share on Facebook",is:"Deila á Facebook"};t.txt=e[t.lang];if(!t.txt){t.lang="en";t.txt=e.en}}if(t.custom){t.$tmpl=u.fbshare.$lnk+'%{url}" class="fbsharebtn">{txt}</a>'}else{t.width="5.636em";t.height="1.818em"}},$lnk:'<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="fbshare" href="//www.facebook.com/sharer.php?u=',$tmpl:'<iframe data-sharebtns="fbshare" style="width:{width};height:{height};font-size:11px;" allowtransparency="true" frameborder="0" scrolling="no" />',$init:function(t){var e=this,n=t.filter("iframe").add(t.find("iframe")).eq(0).contents()[0];n.write('<!DOCTYPE html><html lang="'+(e.lang||"en")+'">'+'<head><meta charset="UTF-8" /><title>.</title>'+'<link href="https://codecentre.eplica.is/f/fb-share.css" rel="stylesheet" type="text/css" />'+'</head><body class="'+(e.color||"")+'">'+e.$lnk+o(e.url)+'">'+e.txt+"</a>"+"</body></html>");n.close()},$pos:40},facebook:{width:null,count:"button_count",sendBtn:false,faces:false,color:"",verb:"",custom:false,$prep:function(){var t=this;t.width=t.width||(t.count==="box_count"?85:120)},$tmpl:'<div class="fb-like" data-send="{sendBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-colorscheme="{color}" data-href="{url}" />',$init:function(){if(!t("#fb-root")[0]){t("body").prepend('<div id="fb-root"/>')}f("//connect.facebook.net/"+this.$locale()+"/all.js#xfbml=1",function(){e.FB&&e.FB.XFBML.parse()})},$loc:null,$locs:{is:"is_IS",dk:"dk_DK",pl:"pl_PL",fo:"fo_FO",no:"nn_NO",se:"sv_SE",de:"de_DE"},$locale:function(){var t=this;return t.$loc||(t.$loc=t.$locs[t.lang]||"en_US")},$pos:50},gplus:{count:"",size:"medium",custom:false,$prep:function(){this.count=this.count?' data-annotation="'+this.count+'"':""},$tmpl:'<div class="g-plusone" data-size="{size}"{count} data-href="{url}"/>',$init:function(){f("//apis.google.com/js/plusone.js",function(){e.gapi&&e.gapi.plusone.go()})},$pos:20},pinterest:{imgsrc:"",count:"beside",imgSelector:".pgmain img",txt:"Pin it",$prep:function(){var e=this;if(!e.imgsrc){e.imgsrc=e.imgSelector&&t(e.imgSelector).attr(e.imgSrcAttr||"src")||t('meta[property="og:image"]').attr("content")||t("img").attr("src");if(!/^(https?:)?\/\//.test(e.imgsrc)){e.imgsrc=n.protocol+"//"+n.host+"/"+e.imgsrc.replace(/^\//,"")}}if(e.custom){e.$tmpl='<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pinitbtn" onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="pinitwin" lang="en">{txt}</a>'}},$tmpl:'<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" data-pin-do="buttonPin" data-pin-config="{count}" lang="en">{txt}</a>',$init:function(){h("https://assets.pinterest.com/js/pinit.js")},$pos:30}};u.fbshare2=t.extend({},u.fbshare,{custom:1});var p={},h=function(e){clearTimeout(p[e]);p[e]=setTimeout(function(){t.ajax({dataType:"script",cache:true,url:e})},100)},f=function(e,n){var o=p[e];if(!o){p[e]=o={};t("<script/>").attr("src",e).each(function(){t("head")[0].appendChild(this)}).on(a,function(){var e=this;if(!e.readyState||/^(loaded|complete)$/.test(e.readyState)){o.loaded=1;if(n){clearTimeout(o.timeout);o.timeout=setTimeout(n,100)}t(e).off(a)}})}else if(n&&o.loaded){clearTimeout(o.timeout);o.timeout=setTimeout(n,100)}}})(jQuery,window,document.location,encodeURIComponent,"load readystatechange");
