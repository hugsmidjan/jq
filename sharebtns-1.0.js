// $.fn.sharebtns 1.0  -- (c) 2012 Hugsmiðjan ehf.
!function(t,e,n,i){var o,a=t.fn.sharebtns=function(e){o=o||t("html").attr("lang").substr(0,2)||"en";var i=[];if(this.length){e=t.extend(true,{},r,e);t.each(l,function(a,r){var s=e[a];if(s){var l=e[a]=t.extend({custom:e.custom,url:e.url,lang:o},r);t.each(c,function(n,i){i=i[a];e[n]&&i&&t.extend(l,i)});t.extend(l,s);l.$pos=typeof s==="number"?s:l.$pos||0;l.$prep&&l.$prep(e);var u=l.$tmpl.replace(/(%=?)?\{(.+?)\}/g,function(t,e,i){var o=l[i];return!e?o:e==="%"?n(o):o!=null?i+"="+n(o)+"&amp;":""});if(e.wrap){u="<"+e.wrap+" class="+a+">"+u+"</"+e.wrap+">"}u=t(e.process?e.process(u,a,l):u);u.$pos=l.$pos;i.push(u);!l.custom&&l.$init&&setTimeout(function(){l.$init(u,e)},0)}});i=t.map(i.sort(function(t,e){var n=t.$pos-e.$pos;return n>0?1:n<0?-1:0}),function(t){return t.toArray()});this[e.insertion](i)}return this.pushStack(i)},r=a.defaults={twitter:true,facebook:true,insertion:"append",url:t('link[rel="canonical"]').prop("href")||e.href.split("#")[0].replace(/[?&]fb_action_ids=.+/,"")},s={count:"none"},c={dark:{fbshare:{color:"dark"},facebook:{color:"dark"}},large:{twitter:{size:"l"},facebook:{},gplus:{size:""},pinterest:{}},countNone:{twitter:s,facebook:{count:"standard"},gplus:s,pinterest:s},countV:{twitter:{count:"vertical"},facebook:{count:"box_count"},gplus:{count:"",size:"tall"},pinterest:{count:"above"}}},l=a.btnDefaults={twitter:{size:"m",count:"",via:"",related:"",lang:"",hashtags:"",text:"",$prep:function(){var t=this;if(t.custom){var e={en:"Tweet this!",is:"Senda á Twitter"};t.txt=t.txt||e[t.lang]||e.en;t.$tmpl='<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="tweetit"'+' href="https://twitter.com/intent/tweet?%={via}%={related}%={hashtags}%={text}%={url}%={lang}"'+">{txt}</a>"}else{var n=!t.count||t.count==="horizontal",i=t.count==="vertical",o=t.size==="l";t.width=n&&o?"138px":n?"110px":o?"76px":"58px";t.height=o?"28px":i?"62px":"20px"}},$tmpl:'<iframe src="//platform.twitter.com/widgets/tweet_button.html?%={size}%={count}%={via}%={related}%={hashtags}%={text}%={url}%={lang}" style="width:{width}; height:{height};" allowtransparency="true" frameborder="0" scrolling="no" />',$pos:10},fbshare:{color:"",$prep:function(){var t=this,e={en:"Share",is:"Deila"};if(!t.txt){t.txt=e[t.lang];if(!t.txt){t.lang="en";t.txt=e.en}}if(t.custom){t.$tmpl=l.fbshare.$lnk+'%{url}" class="fbsharebtn">{txt}</a>'}else{t.width="5.636em";t.height="1.818em"}},$lnk:'<a onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="fbshare" href="//www.facebook.com/sharer.php?u=',$tmpl:'<iframe data-sharebtns="fbshare" style="width:{width};height:{height};font-size:11px;" allowtransparency="true" frameborder="0" scrolling="no" />',$init:function(t){var e=this,i=t.filter("iframe").add(t.find("iframe")).eq(0).contents()[0];i.write('<!DOCTYPE html><html lang="'+e.lang+'">'+'<head><meta charset="UTF-8" /><title>.</title>'+'<link href="https://codecentre.eplica.is/f/fb-share.css" rel="stylesheet" type="text/css" />'+'</head><body class="'+(e.color||"")+'">'+e.$lnk+n(e.url)+'">'+e.txt+"</a>"+"</body></html>");i.close()},$pos:40},facebook:{width:null,count:"button_count",sendBtn:false,faces:false,color:"",verb:"",custom:false,$prep:function(){var t=this;t.width=t.width||(t.count==="box_count"?85:120)},$tmpl:'<div class="fb-like" data-send="{sendBtn}" data-layout="{count}" data-width="{width}" data-show-faces="{faces}" data-action="{verb}" data-colorscheme="{color}" data-href="{url}" />',$init:function(){if(!t("#fb-root")[0]){t("body").prepend('<div id="fb-root"/>')}h("//connect.facebook.net/"+this.$locale()+"/all.js#xfbml=1",function(){window.FB&&FB.XFBML.parse()})},$loc:"",$locs:{is:"is_IS",dk:"dk_DK",pl:"pl_PL",fo:"fo_FO",no:"nn_NO",se:"sv_SE",de:"de_DE"},$locale:function(){this.$loc=this.$loc||this.$locs[t("html").attr("lang").substr(0,2)]||"en_US";return this.$loc},$pos:50},gplus:{count:"",size:"medium",custom:false,$prep:function(){this.count=this.count?' data-annotation="'+this.count+'"':""},$tmpl:'<div class="g-plusone" data-size="{size}"{count} data-href="{url}"/>',$init:function(){h("//apis.google.com/js/plusone.js",function(){window.gapi&&gapi.plusone.go()})},$pos:20},pinterest:{imgsrc:"",count:"beside",imgSelector:".pgmain img",$prep:function(){var n=this;if(!n.imgsrc){n.imgsrc=n.imgSelector&&t(n.imgSelector).attr(n.imgSrcAttr||"src")||t('meta[property="og:image"]').attr("content")||t("img").attr("src");if(!/^(https?:)?\/\//.test(n.imgsrc)){n.imgsrc=e.protocol+"//"+e.host+"/"+n.imgsrc.replace(/^\//,"")}}if(n.custom){n.$tmpl='<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pinitbtn" onclick="window.open(this.href,null,\'toolbar=0,status=0,width=626,height=436\');return false;" target="pinitwin" lang="en">Pin It</a>'}},$tmpl:'<a href="http://pinterest.com/pin/create/button/?url=%{url}&amp;media=%{imgsrc}" class="pin-it-button" data-pin-do="buttonPin" data-pin-config="{count}" lang="en">Pin It</a>',$init:function(){p("https://assets.pinterest.com/js/pinit.js")},$pos:30}};l.fbshare2=t.extend({},l.fbshare,{custom:1});var u={},p=function(e){clearTimeout(u[e]);u[e]=setTimeout(function(){t.ajax({dataType:"script",cache:true,url:e})},100)},h=function(e,n){var o=u[e];if(!o){u[e]=o={};t("<script/>").attr("src",e).each(function(){t("head")[0].appendChild(this)}).on(i,function(){var e=this;if(!e.readyState||/^(loaded|complete)$/.test(e.readyState)){o.loaded=1;if(n){clearTimeout(o.timeout);o.timeout=setTimeout(n,100)}t(e).off(i)}})}else if(n&&o.loaded){clearTimeout(o.timeout);o.timeout=setTimeout(n,100)}}}(jQuery,document.location,encodeURIComponent,"load readystatechange");
