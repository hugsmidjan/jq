/* $.fn.sharebtns 1.0  -- (c) 2012-2014 Hugsmiðjan ehf.  @preserve */
!function(t,e,n,o,a){"use strict";var i,r,s=t.fn.sharebtns=function(e){i=i||t("html").attr("lang").substr(0,2)||"en";var n=[],a=this.eq(0);return a[0]&&(e=t.extend(!0,{},c,e),r=r||t("<a/>")[0],t.each(f,function(a,s){var c=e[a];if(c){var l=e[a]=t.extend({custom:e.custom,url:e.url,lang:i},s);t.each(u,function(n,o){o=o[a],e[n]&&o&&t.extend(l,o)}),t.isPlainObject(c)&&t.extend(l,c),r.href=l.url,l.url=r.href,l.$pos="number"==typeof c?c:l.$pos||0,l.$prep&&l.$prep(e);var p=(l.custom&&l.$tmpl2||l.$tmpl).replace(/(%=?)?\{(.+?)\}/g,function(t,e,n){var a=l[n];return a=null==a?"":a,e?"%"===e?o(a):a?n+"="+o(a)+"&amp;":"":a});e.wrap&&(p="<"+e.wrap+" class="+a+">"+p+"</"+e.wrap+">"),p=t(e.process?e.process(p,a,l):p),p.$pos=l.$pos,n.push(p),!l.custom&&l.$init&&setTimeout(function(){l.$init(p,e)},0)}}),n=t.map(n.sort(function(t,e){var n=t.$pos-e.$pos;return n>0?1:0>n?-1:0}),function(t){return t.toArray()}),a[e.insertion](n)),this.pushStack(n)},c=s.defaults={twitter:!0,facebook:!0,insertion:"append",url:t('link[rel="canonical"]').prop("href")||n.href.split("#")[0].replace(/[?&]fb_action_ids=.+/,"")},l={count:"none"},u={large:{twitter:{size:"l"},gplus:{size:""}},countNone:{twitter:l,gplus:l,fbshare:{count:"button"},pinterest:l,linkedin:{count:""}},countV:{twitter:{count:"vertical"},gplus:{count:"",size:"tall"},fbshare:{count:"box_count"},facebook:{count:"box_count"},pinterest:{count:"above"},linkedin:{count:"top"}}},p={is:"is_IS",dk:"dk_DK",pl:"pl_PL",fo:"fo_FO",no:"nn_NO",se:"sv_SE",de:"de_DE",fr:"fr_FR",es:"es_ES",en:"en_US"},m=function(t,e){return p[t]||p[e||"en"]},h=" onclick=\"window.open(this.href,null,'toolbar=0,status=0,width=626,height=436');return false;\" target=",d="<a"+h+'"fbshare" href="//www.facebook.com/sharer.php?u=',f=s.btnDefaults={twitter:{size:"m",count:"",$prep:function(){var t=this;if(t.custom){var e={en:"Tweet this!",is:"Senda á Twitter"};t.txt=t.txt||e[t.lang]||e.en}else{var n=!t.count||"horizontal"===t.count,o="vertical"===t.count,a="l"===t.size;t.width=n&&a?"138px":n?"110px":a?"76px":"58px",t.height=a?"28px":o?"62px":"20px"}},$tmpl:'<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" title="Twitter Tweet Button" />',$tmpl2:"<a"+h+'"tweetit" href="https://twitter.com/intent/tweet?%={via}%={related}%={hashtags}%={text}%={url}%={lang}">{txt}</a>',$pos:20},fbshare:{width:10,count:"button_count",$prep:function(){var t=this;if(t.custom&&!t.txt){var e={en:"Share on Facebook",is:"Deila á Facebook"};t.txt=e[t.lang],t.txt||(t.lang="en",t.txt=e.en)}},$tmpl:'<div class="fb-share-button" data-href="{url}" data-width="{width}" data-type="{count}"/>',$tmpl2:d+'%{url}" class="fbsharebtn">{txt}</a>',$init:function(){f.facebook.$init.call(this)},$pos:11},facebook:{width:10,count:"button_count",shareBtn:!1,faces:!1,custom:!1,$tmpl:'<div class="fb-like" data-share="{shareBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-href="{url}" data-colorScheme="{color}"/>',$init:function(){t("#fb-root")[0]||t("body").prepend('<div id="fb-root"/>'),x("//connect.facebook.net/"+m(this.lang,"en")+"/sdk.js#xfbml=1&version=v2.0&appId=113869198637480",function(){e.FB&&e.FB.XFBML.parse()}).attr("id","facebook-jssdk")},$pos:10},gplus:{count:"",size:"medium",$prep:function(){var t=this;if(t.custom){var e={en:"Share on Google+",is:"Deila á Google+"};t.txt=t.txt||e[t.lang]||e.en}else t.count=t.count?' data-annotation="'+t.count+'"':""},$tmpl:'<div class="g-plusone" data-size="{size}"{count} data-href="{url}"/>',$tmpl2:'<a href="https://plus.google.com/share?url=%{url}" class="gplusbtn"'+h+'"gpluswin">{txt}</a>',$init:function(){x("//apis.google.com/js/platform.js",function(){e.gapi&&e.gapi.plusone.go()})},$pos:30},linkedin:{count:"right",$prep:function(){var e=this;if(e.custom){var n={en:"Share on LinkedIn",is:"Deila á LinkedIn"};e.txt=e.txt||n[e.lang]||n.en,e.source=e.source||t(".brand > a").text()||t(".brand img.logo").attr("alt"),e.title=e.title||e.titleSel&&t(e.titleSel).text()||t('meta[property="og:title"]').attr("content")||t("h1:first").text()||document.title,e.text=e.text||e.textSel&&t(e.textSel).text()||t('meta[property="og:description"]').attr("content")||t('meta[name="description"]').attr("content")}else e.count=e.count?' data-counter="'+e.count+'"':""},$tmpl:'<script type="IN/Share" data-url="{url}"{count} data-showzero="true"/>',$tmpl2:'<a href="https://www.linkedin.com/shareArticle?mini=true&amp;url=%{url}&amp;title=%{title}&amp;summary=%{text}&amp;source=%{source}" class="linkedinbtn"'+h+'"linkedinwin">{txt}</a>',$init:function(t){x("//platform.linkedin.com/in.js",null,"lang: "+m(t.lang))},$pos:50},pinterest:{imgsrc:"",count:"beside",imgSelector:".pgmain img",txt:"Pin it",$prep:function(){var e=this;e.imgsrc||(e.imgsrc=e.imgSelector&&t(e.imgSelector).attr(e.imgSrcAttr||"src")||t('meta[property="og:image"]').attr("content")||t("img").attr("src"),/^(https?:)?\/\//.test(e.imgsrc)||(e.imgsrc=n.protocol+"//"+n.host+"/"+e.imgsrc.replace(/^\//,"")))},$tmpl:'<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" data-pin-do="buttonPin" data-pin-config="{count}" lang="en">{txt}</a>',$tmpl2:'<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pinitbtn"'+h+'"pinitwin" lang="en">{txt}</a>',$init:function(){w("https://assets.pinterest.com/js/pinit.js")},$pos:40}};f.fbshare2=t.extend({},f.fbshare,{custom:1});var g={},b=300,w=function(t,e,n){x(t,e,n,!0)},x=function(e,n,o,i){var r=g[e];return i||!r?(g[e]=r=r||{elm:t("<script/>")},clearTimeout(r.s),r.s=setTimeout(function(){r.elm.attr("src",e).html(o||"").each(function(){t("head")[0].appendChild(this)}).on(a,function(){var e=this;(!e.readyState||/^(loaded|complete)$/.test(e.readyState))&&(r.loaded=1,n&&(clearTimeout(r.t),r.t=setTimeout(n,i?0:b)),t(e).off(a))})},i?b:0)):n&&r.loaded&&(clearTimeout(r.t),r.t=setTimeout(n,b)),r.elm}}(jQuery,window,document.location,encodeURIComponent,"load readystatechange");
