// $.fn.tabSwitcher/.makeTabbox  1.0  -- (c) 2009 Hugsmiðjan ehf.
(function(b,o){var r,K,L=false,s={},t={},p,u='tabswitcher',l=u,v=function(c){var e=b('#'+c);var d=e.data(l);var a=d.config;d.tab.removeClass(a.currentTabClass);if(a.currentTabTag){d.tab.find(a.currentTabTag).zap()}if(a.cssHide){e.addClass(a.hiddenPaneClass)}else{e.hide()}if(a.openTabId==c){delete a.openTabId}delete s[c];d.block.trigger('Tabclose',c);e.trigger('Panelclose',c)},A=function(c){var e=b('#'+c);var d=e.data(l);var a=d.config;d.tab.addClass(a.currentTabClass);if(a.currentTabTag&&!b(a.currentTabTag,d.link).length){d.link.wrapInner('<'+a.currentTabTag+'/>')}if(a.cssHide){e.removeClass(a.hiddenPaneClass)}else{e.show()}a.openTabId=c;s[c]=true;d.block.trigger('Tabopen',c);e.trigger('Panelopen',c)},B=function(c){var e=b(c.target).closest('a, area');if(e.is('[href*="#"]')&&!e.data(l+'Link')&&o.location.href.split('#')[0]==e[0].href.split('#')[0]){var d=b.getFrag(e[0].href);if(d&&t[d]){b.tabSwitcher.switchTo(d);c.preventDefault()}}},C=function(c){b.tabSwitcher.switchTo(this);c.preventDefault()},w=function(c){b(this).parent().data(l).tab.setFocus();return false},D=function(c){c.target!==this&&b.tabSwitcher.switchTo(this.id,true)},M=function(){};b.extend({tabSwitcher:{version:1.0,fixInitScroll:true,cookieName:u,cookiePath:'/',cookieTTL:1200,defaultConfig:{tabSelector:'li',stripActiveClass:'tabs-active',currentTabClass:'current',currentTabTag:'strong',paneClass:'tabpane',hiddenPaneClass:'tabpane-hidden',cssHide:false,showFirst:true,setCookie:true,setFragment:true,focusLinkTemplate:'<a href="#" class="focustarget">.</a>',returnLinkTemplate:'<a href="#" class="stream">.</a>',en:{backLinkText:'Back to '},is:{backLinkText:'Til baka í '}},switchTo:function(c,e){var d=c.href?b.getFrag(c.href):c,a=b('#'+d),h=a.data(l),i=h.config,g=i.openTabId;if(i){h.block.trigger('Tabswitch',{from:g,to:d});if(i.openTabId!=d){if(i.openTabId){v(i.openTabId)}A(d)}if(!e){if(i.setFragment){b.setFrag(d)}if(h.focusLink){b.setFocus(h.focusLink)}}h.block.trigger('Tabswitched',{from:g,to:d})}}}});b.fn.tabSwitcher=function(E){var F=b.getFrag();p=[[],[],[],[]];this.each(function(){var x=b(this),f=b.extend({},b.tabSwitcher.defaultConfig,E),G=b(f.tabSelector,this),m='',j=0;f.tabs={};f.tabBlock=this;G.each(function(e,d){var a={tab:b(d)},h=a.link=(d.tagName=='A')?a.tab:b('a',d),i=(h.closest('[lang]').attr('lang')||'en').substr(0,2);a.lang=f[i]?i:'en';a.config=f;a.block=x;var g=b.getFrag(h.attr('href')),k=b(g?'#'+g:[]);k.data(l,a);if(k.length){k.addClass(f.paneClass);var n=f[a.lang].backLinkText+a.tab.text();if(f.focusLinkTemplate){a.focusLink=b(f.focusLinkTemplate).attr('title',n).bind('click',w).prependTo(k)}if(f.returnLinkTemplate){a.returnLink=b(f.returnLinkTemplate).attr('title',n).bind('click',w).appendTo(k)}if(!e&&!m&&f.showFirst){m=g;j=1}if(j<2&&a.tab.hasClass(f.currentTabClass)){m=g;j=2}if(j<3&&f.setCookie&&r&&b.inArray(r,g)>-1){m=g;j=3}if(j<4&&F==g){b(window).scrollTop(0);m=g;j=4}a.tab.bind('click',function(c){return false});(a.tab.is('a')?a.tab:a.tab.find('a:first')).data(l+'Link',1).bind('click',C);v(g);t[g]=true;k.bind('Tabswitch',D)}});x.addClass(f.stripActiveClass);if(m){p[j-1].unshift(m)}if(b.tabSwitcher.fixInitScroll&&j==4&&!f.setFragment){o.location.hash=''}});for(var q=0;q<4;q++){var H=p[q];for(var y=0,z;(z=H[y]);y++){b.tabSwitcher.switchTo(z,true)}}b(o).bind('click',B);return this};var I=b.fn.makeTabbox=function(a){a=b.beget(J,a);var h=[],i=this;if(i.length>=a.min){h=b(a.boxTempl).addClass(a.boxClass);var g=a.tabContSel?b(a.tabContSel,h):h,k=i.eq(0).parent(),n=k.closest('[lang]').attr('lang')||'';k.attr('lang',n);i.each(function(){var c=b(this);c.aquireId(a.defaultId);var e=a.makeTab(c,a).appendTo(g),d=c.closest('[lang]').attr('lang');d&&d!=n&&e.attr('lang',d)}).eq(0).before(h)}return this.pushStack(h)},J=I.defaults={min:2,defaultId:'tab1',tabContSel:'ul',titleSel:'h1, h2, h3',boxClass:'tab-box',boxTempl:'<div><ul class="tabs" /></div>',tabTempl:'<li><a href="#%{id}" title="%{title}">%{title}</a></li>',makeTab:function(c,e){return b(b.inject(e.tabTempl,{id:c[0].id,title:c.find(e.titleSel).eq(0).text()}))}}})(jQuery,document);
