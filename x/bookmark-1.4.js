﻿/* http://keith-wood.name/bookmark.html
   Sharing bookmarks for jQuery v1.4.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) March 2008.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses.
   Please attribute the author if you use it. */
(function($){var q='bookmark';function Bookmark(){this._defaults={url:'',sourceTag:'',title:'',description:'',sites:[],iconsStyle:'bookmark_icons',icons:'bookmarks.png',iconSize:16,iconCols:16,target:'_blank',compact:true,hint:'Send to {s}',popup:false,popupText:'Bookmark this site...',addFavorite:false,favoriteText:'Favorite',favoriteIcon:0,addEmail:false,emailText:'E-mail',emailIcon:1,emailSubject:'Interesting page',emailBody:'I thought you might find this page interesting:\n{t} ({u})',manualBookmark:'Please close this dialog and\npress Ctrl-D to bookmark this page.',addShowAll:false,showAllText:'Show all ({n})',showAllIcon:2,showAllTitle:'All bookmarking sites',onSelect:null,addAnalytics:false,analyticsName:'/share/{r}/{s}'};this._sites={'aol':{display:'myAOL',icon:3,lang:'en',category:'bookmark',url:'http://favorites.my.aol.com/ffclient/AddBookmark?url={u}&amp;title={t}'},'bitly':{display:'bit.ly',icon:4,lang:'en',category:'tools',url:'http://bit.ly/?url={u}'},'blogger':{display:'Blogger',icon:5,lang:'en',category:'blog',url:'http://www.blogger.com/blog_this.pyra?t=&amp;u={u}&amp;n={t}'},'delicious':{display:'del.icio.us',icon:6,lang:'en',category:'bookmark',url:'http://del.icio.us/post?url={u}&amp;title={t}'},'digg':{display:'Digg',icon:7,lang:'en',category:'news',url:'http://digg.com/submit?phase=2&amp;url={u}&amp;title={t}'},'diigo':{display:'Diigo',icon:8,lang:'en',category:'social',url:'http://www.diigo.com/post?url={u}&amp;title={t}'},'dzone':{display:'DZone',icon:9,lang:'en',category:'bookmark',url:'http://www.dzone.com/links/add.html?url={u}&amp;title={t}'},'facebook':{display:'Facebook',icon:10,lang:'en',category:'social',url:'http://www.facebook.com/sharer.php?u={u}&amp;t={t}'},'fark':{display:'Fark',icon:11,lang:'en',category:'news',url:'http://cgi.fark.com/cgi/fark/submit.pl?new_url={u}&amp;new_comment={t}'},'google':{display:'Google',icon:12,lang:'en',category:'bookmark',url:'http://www.google.com/bookmarks/mark?op=edit&amp;bkmk={u}&amp;title={t}'},'googlereader':{display:'Google Reader',icon:13,lang:'en',category:'tools',url:'http://www.google.com/reader/link?url={u}&amp;title={t}&amp;srcTitle={u}'},'hotmail':{display:'Hotmail',icon:14,lang:'en',category:'mail',url:'http://www.hotmail.msn.com/secure/start?action=compose&amp;to=&amp;body={u}&amp;subject={t}'},'linkedin':{display:'LinkedIn',icon:15,lang:'en',category:'social',url:'http://www.linkedin.com/shareArticle?mini=true&amp;url={u}&amp;title={t}&amp;ro=false&amp;summary={d}&amp;source='},'mixx':{display:'Mixx',icon:16,lang:'en',category:'news',url:'http://www.mixx.com/submit/story?page_url={u}&amp;title={t}'},'multiply':{display:'Multiply',icon:17,lang:'en',category:'social',url:'http://multiply.com/gus/journal/compose/addthis?body=&amp;url={u}&amp;subject={t}'},'myspace':{display:'MySpace',icon:18,lang:'en',category:'social',url:'http://www.myspace.com/Modules/PostTo/Pages/?u={u}&amp;t={t}'},'netvibes':{display:'Netvibes',icon:19,lang:'en',category:'news',url:'http://www.netvibes.com/share?url={u}&amp;title={t}'},'newsvine':{display:'Newsvine',icon:20,lang:'en',category:'news',url:'http://www.newsvine.com/_wine/save?u={u}&amp;h={t}'},'reddit':{display:'reddit',icon:21,lang:'en',category:'news',url:'http://reddit.com/submit?url={u}&amp;title={t}'},'stumbleupon':{display:'StumbleUpon',icon:22,lang:'en',category:'bookmark',url:'http://www.stumbleupon.com/submit?url={u}&amp;title={t}'},'technorati':{display:'Technorati',icon:23,lang:'en',category:'news',url:'http://www.technorati.com/faves?add={u}'},'tipd':{display:'Tip\'d',icon:24,lang:'en',category:'news',url:'http://tipd.com/submit.php?url={u}'},'tumblr':{display:'tumblr',icon:25,lang:'en',category:'blog',url:'http://www.tumblr.com/share?v=3&amp;u={u}&amp;t={t}'},'twitter':{display:'twitter',icon:26,lang:'en',category:'blog',url:'http://twitter.com/home?status={t}%20{u}'},'windows':{display:'Windows Live',icon:27,lang:'en',category:'bookmark',url:'https://favorites.live.com/quickadd.aspx?marklet=1&amp;mkt=en-us&amp;url={u}&amp;title={t}'},'wishlist':{display:'Amazon WishList',icon:28,lang:'en',category:'shopping',url:'http://www.amazon.com/wishlist/add?u={u}&amp;t={t}'},'yahoo':{display:'Yahoo Bookmarks',icon:29,lang:'en',category:'bookmark',url:'http://bookmarks.yahoo.com/toolbar/savebm?opener=tb&amp;u={u}&amp;t={t}'},'yahoobuzz':{display:'Yahoo Buzz',icon:30,lang:'en',category:'bookmark',url:'http://buzz.yahoo.com/submit?submitUrl={u}&amp;submitHeadline={t}'}};this.commonSites=[];for(var a in this._sites){this.commonSites.push(a)}}$.extend(Bookmark.prototype,{markerClassName:'hasBookmark',setDefaults:function(a){extendRemove(this._defaults,a||{});return this},addSite:function(a,b,c,d,e,f){this._sites[a]={display:b,icon:c,lang:d,category:e,url:f};return this},getSites:function(){return this._sites},_attachBookmark:function(a,b){a=$(a);if(a.hasClass(this.markerClassName)){return}a.addClass(this.markerClassName);this._updateBookmark(a,b)},_changeBookmark:function(a,b,c){a=$(a);if(!a.hasClass(this.markerClassName)){return}if(typeof b=='string'){var d=b;b={};b[d]=c}this._updateBookmark(a,b)},_updateBookmark:function(g,h){var i=$.data(g[0],q)||$.extend({},this._defaults);h=extendRemove(i,h||{});$.data(g[0],q,h);var j=h.sites;if(j.length==0){$.each($.bookmark._sites,function(a){j.push(a)});j.sort()}else{$.each(j,function(c,d){var e=d.match(/lang:(.*)/);if(e){$.each($.bookmark._sites,function(a,b){if(b.lang==e[1]&&$.inArray(a,j)==-1){j.push(a)}})}var f=d.match(/category:(.*)/);if(f){$.each($.bookmark._sites,function(a,b){if(b.category==f[1]&&$.inArray(a,j)==-1){j.push(a)}})}})}g.empty();var k=g;if(h.popup){g.append('<a href="#" class="bookmark_popup_text">'+h.popupText+'</a>');k=$('<div class="bookmark_popup"></div>').appendTo(g)}var l=$.bookmark._getSiteDetails(h);var m=$('<ul class="bookmark_list'+(h.compact?' bookmark_compact':'')+'"></ul>').appendTo(k);if(h.addFavorite){$.bookmark._addOneSite(h,m,h.favoriteText,h.favoriteIcon,'#',function(){$.bookmark._addFavourite(l.url.replace(/'/g,'\\\''),l.title.replace(/'/g,'\\\''));return false})}if(h.addEmail){$.bookmark._addOneSite(h,m,h.emailText,h.emailIcon,'mailto:?subject='+encodeURIComponent(h.emailSubject)+'&amp;body='+encodeURIComponent(h.emailBody.replace(/\{u\}/,l.url).replace(/\{t\}/,l.title).replace(/\{d\}/,l.desc)))}$.bookmark._addSelectedSites(j,l,h,m);if(h.addShowAll){var o=0;for(var n in $.bookmark._sites){o++}var p=h.showAllText.replace(/\{n\}/,o);$.bookmark._addOneSite(h,m,p,h.showAllIcon,'#',function(){$.bookmark._showAll(this,h);return false},p)}if(h.popup){g.find('.bookmark_popup_text').click(function(){var a=$(this).parent();var b=a.offset();a.find('.bookmark_popup').css('left',b.left).css('top',b.top+a.outerHeight()).toggle();return false});$(document).click(function(a){g.find('.bookmark_popup').hide()})}},_addSelectedSites:function(d,e,f,g){$.each(d,function(a,b){var c=$.bookmark._sites[b];if(c){$.bookmark._addOneSite(f,g,c.display,c.icon,(f.onSelect?'#':c.url.replace(/\{u\}/,e.url2+(e.sourceTag?e.sourceTag+b:'')).replace(/\{t\}/,e.title2).replace(/\{d\}/,e.desc2)),function(){if(f.addAnalytics&&window.pageTracker){window.pageTracker._trackPageview(f.analyticsName.replace(/\{s\}/,b).replace(/\{n\}/,c.display).replace(/\{u\}/,e.url).replace(/\{r\}/,e.relUrl).replace(/\{t\}/,e.title))}$('#bookmark_all').remove();$(document).unbind('click.bookmark');if(f.onSelect){$.bookmark._selected($(this).closest('.'+$.bookmark.markerClassName)[0],b);return false}return true})}})},_addOneSite:function(a,b,c,d,e,f,g){var h=a.hint||'{s}';var i='<li><a href="'+e+'"'+(a.target?' target="'+a.target+'"':'')+'>';if(d!=null){var j=g||h.replace(/\{s\}/,c);if(typeof d=='number'){i+='<span title="'+j+'" '+(a.iconsStyle?'class="'+a.iconsStyle+'" ':'')+'style="'+(a.iconsStyle?'background-position: ':'background: transparent url('+(Req.baseUrl?Req.baseUrl+'x/bookmarks-1.4-icons.gif':a.icons)+') no-repeat ')+'-'+((d%a.iconCols)*a.iconSize)+'px -'+(Math.floor(d/a.iconCols)*a.iconSize)+'px;'+($.browser.mozilla&&$.browser.version<'1.9'?' padding-left: '+a.iconSize+'px; padding-bottom: '+(Math.max(0,a.iconSize-16))+'px;':'')+'"></span>'}else{i+='<img src="'+d+'" alt="'+j+'" title="'+j+'"'+(($.browser.mozilla&&$.browser.version<'1.9')||($.browser.msie&&$.browser.version<'7.0')?' style="vertical-align: bottom;"':($.browser.msie?' style="vertical-align: middle;"':($.browser.opera||$.browser.safari?' style="vertical-align: baseline;"':'')))+'/>'}i+=(a.compact?'':'&#xa0;')}i+=(a.compact?'':c)+'</a></li>';i=$(i).appendTo(b);if(f){i.find('a').click(f)}},_destroyBookmark:function(a){a=$(a);if(!a.hasClass(this.markerClassName)){return}a.removeClass(this.markerClassName).empty();$.removeData(a[0],q)},_selected:function(a,b){var c=$.data(a,q);var d=$.bookmark._sites[b];var e=$.bookmark._getSiteDetails(c);c.onSelect.apply(a,[b,d.display,d.url.replace(/&amp;/g,'&').replace(/\{u\}/,e.url2+(e.sourceTag?e.sourceTag+b:'')).replace(/\{t\}/,e.title2).replace(/\{d\}/,e.desc2)])},_addFavourite:function(a,b){if($.browser.msie){window.external.addFavorite(a,b)}else{alert(this._defaults.manualBookmark)}},_showAll:function(b,c){var d=[];$.each($.bookmark._sites,function(a){d.push(a)});d.sort();var e=$.bookmark._getSiteDetails(c);var f=$('<ul class="bookmark_list"></ul>');var g=c.compact;c.compact=false;$.bookmark._addSelectedSites(d,e,c,f);c.compact=g;var h=$('<div id="bookmark_all"><p>'+c.showAllTitle+'</p></div>').append(f).appendTo('body');h.css({left:($(window).width()-h.width())/2,top:($(window).height()-h.height())/2}).show();$(document).bind('click.bookmark',function(a){if($(a.target).closest(b).length==0&&$(a.target).closest('#bookmark_all').length==0){$('#bookmark_all').remove();$(document).unbind('click.bookmark')}})},_getSiteDetails:function(a){var b=a.url||window.location.href;var c=a.title||document.title||$('h1:first').text();var d=a.description||$('meta[name="description"]').attr('content')||'';var e=(!a.sourceTag?'':encodeURIComponent((b.indexOf('?')>-1?'&':'?')+a.sourceTag+'='));return{url:b,title:c,desc:d,relUrl:b.replace(/^.*\/\/[^\/]*\//,''),sourceTag:e,url2:encodeURIComponent(b),title2:encodeURIComponent(c),desc2:encodeURIComponent(d)}}});function extendRemove(a,b){$.extend(a,b);for(var c in b){if(b[c]==null){a[c]=null}}return a}$.fn.bookmark=function(a){var b=Array.prototype.slice.call(arguments,1);return this.each(function(){if(typeof a=='string'){if(!$.bookmark['_'+a+'Bookmark']){throw'Unknown operation: '+a;}$.bookmark['_'+a+'Bookmark'].apply($.bookmark,[this].concat(b))}else{$.bookmark._attachBookmark(this,a||{})}})};$.bookmark=new Bookmark()})(jQuery);
