// encoding: utf-8
// jQuery.fn.virtualBrowser 1.1 - MIT/GPL Licensed - More info: http://github.com/maranomynet/virtualbrowser/
(function(d,o){d.injectBaseHrefToHtml=function(e,h){var a=h.split('#')[0],c=a[k](/([^?]*\/)?(.*)/,'$2'),i=a.split('?')[0][k](/(.*\/)?.*/,'$1');e=e[k](/(<[^>]+ (href|src|action)=["'])(["'#])/gi,'$1'+c+'$3')[k](/(<[^>]+ (href|src|action)=["'])\?/gi,'$1'+c.split('?')[0]+'?')[k](/(["'])([a-z]{3,12}:)/gi,'$1`<<`>>$2')[k](/(<[^>]+ (href|src|action)=["'])([^\/`])/gi,'$1'+i+'$3')[k](/\`<<`>>/g,'');return e};d.getResultBody=function(e){return d('<div/>').append(d(e||[]).not('script,title,meta,link,style').find('script,style').remove().end())};var v=document.location,u='isDefaultPrevented',w='preventDefault',r='stopPropagation',p='passThrough',m='virtualBrowser',x='VBbeforeload',y='VBload',z='VBloaded',k='replace',A=/^(https?:)?\/\//,B={'load':function(a){var c=typeof a!='string'?d(a):o,i=d(this),l=i.data(m),j=l.cfg,f=d.Event(x),g,n,C=j.loadmsgMode,b={elm:c};if(c){a=c.attr('href');a=a===o?c.attr('action'):a}a=b.url=a===''?v.href:a;if(a){f[r]();i.trigger(f,b);if(!f[p]&&((f[p]===o&&c&&c[0].target&&c[0].target!=window.name)||(/^([a-z]{3,12}:|\/\/)/i.test(a)&&!a.toLowerCase()[k](A,'').indexOf(v.href.toLowerCase()[k](A,'').split('/')[0])==0))){f[p]=true}f[p]&&f[w]();if(!f[u]()){var E=b.noCache=b.noCache!==o?b.noCache:j.noCache,s=j.params||'',t='GET';if(c&&c.is('form')){t=c.attr('method')||t;s+='&'+c.serialize();var D=l._0;if(D){s+='&'+d.param(D);delete l._0}}b.params=s;b.method=t;d.ajax({url:b.url.split('#')[0],data:s,type:t,cache:!E,complete:function(e,h){b.result=d.injectBaseHrefToHtml(e.responseText,b.url);b.xhr=e;b.status=h;g=d.Event(y);g[r]();i.trigger(g,b);if(!g[u]()){n=d.Event(z);n[r]();j.loadmsgElm.detach();b.resultDOM=b.resultDOM||d.getResultBody(b.result).contents();i.empty().append(b.resultDOM);l.lastRequest=b;i.trigger(n,b);delete b.resultDOM;delete b.result;delete b.xhr}}});if(C&&C!='none'){j.loadmsgMode=='replace'&&i.empty();i.append(j.loadmsgElm)}}}return f},'data':function(){return d(this).data(m)}},F=function(e){var h=d(e.target).closest(e.type=='click'?'[href], input:submit, button:submit':'form');if(h[0]){if(!e[u]()){if(!h.is(':submit')){var a=B['load'].call(this,h);if(!a[p]){e[w]();a.isPropagationStopped()&&e[r]()}}else if(h.is('[name]')){var c=d(this).data(m);c._0=h;setTimeout(function(){delete c._0},0)}}}},q=d.fn[m]=function(a,c){var i=typeof a=='string';if(i){var l=B[a],j;l&&this.each(function(e){var h=l.apply(this,[].concat(c));if(!e){j=h}});if(j!==o){return j}}else{a=d.extend({},q.defaults,a);c&&(a.url=c);var f=this,g=a.loadmsgElm||'<div class="loading" />',n=(q.i18n[f.closest('*[lang]').attr('lang')]||{}).loading||q.i18n.en.loading;if(g.charAt){g=g.replace(/%\{msg\}/g,n)}g=a.loadmsgElm=d(g);if(!g.text()){g.append(n)}f.data(m,{cfg:a}).bind('click submit',F);a.onLoad&&f.bind(y,a.onLoad);a.onLoaded&&f.bind(z,a.onLoaded);a.onBeforeload&&f.bind(x,a.onBeforeload);a.params=typeof a.params=='string'?a.params:d.param(a.params||{});a.url&&f[m]('load',a.url)}return this};q.defaults={loadmsgMode:'none'};q.i18n={en:{loading:'Loading...'},is:{loading:'Sæki gögn...'}}})(jQuery);
