// encoding: utf-8
// jQuery.fn.virtualBrowser 1.1 - MIT/GPL Licensed - More info: http://github.com/maranomynet/virtualbrowser/
(function(c,w){c.injectBaseHrefToHtml=function(b,e){var f=e.split('#')[0],d=f[o](/([^?]*\/)?(.*)/,'$2'),i=f.split('?')[0][o](/(.*\/)?.*/,'$1');b=b[o](/(<[^>]+ (href|src|action)=["'])(["'#])/gi,'$1'+d+'$3')[o](/(<[^>]+ (href|src|action)=["'])\?/gi,'$1'+d.split('?')[0]+'?')[o](/(["'])([a-z]{3,12}:)/gi,'$1`<<`>>$2')[o](/(<[^>]+ (href|src|action)=["'])([^\/`])/gi,'$1'+i+'$3')[o](/\`<<`>>/g,'');return b};c.getResultBody=c.getResultBody||function(b,e){var f=c.getResultBody;e=e||{};return c('<div/>').append(c(b||[]).not(e.stripFlat||f.stripFlat||'script,title,meta,link,style').find(e.stripDeep||f.stripDeep||'script,style').remove().end())};var E=document.location,z='isDefaultPrevented',F='preventDefault',G='stopPropagation',u='passThrough',n='virtualBrowser',H='VBbeforeload',I='VBload',J='VBerror',K='VBloaded',L='VBdisengaged',o='replace',q='resultDOM',r='result',A='data-srcattr',M=/^(https?:)?\/\//,v=function(e,f,d,i){var k=c.Event(e);f.one(e,function(b){b[G]()}).trigger(k,[d,i]);return k};_2={'load':function(k,t){var a={},g,m,j=c(this),l=j.data(n),h=l.cfg,N;if(c.isPlainObject(k)){c.extend(a,k);m=a.url;delete a.elm}else if(typeof k=='string'){m=k}else{g=c(k);a.elm=g;m=g.attr('href');m=m===w?g.attr('action'):m}m=a.url=(m==='')?E.href:m;if(!l.lastRequest){a.isFirst=true}if(m){if(l._0){a.btn=l._0}var p=v(H,j,a,l);if(!p[u]&&((p[u]===w&&g&&g[0].target&&g[0].target!=window.name)||(/^([a-z]{3,12}:|\/\/)/i.test(m)&&!m.toLowerCase()[o](M,'').indexOf(E.href.toLowerCase()[o](M,'').split('/')[0])==0))){p[u]=true}p[u]&&p[F]();if(!p[z]()){var S=a.noCache=a.noCache!==w?a.noCache:h.noCache,s=h.params?[h.params]:[],x;if(g&&g.is('form')){x=g.attr('method');s.push(g.serialize());var y=l._0;if(y){var B=y.elm;if(B.is(':image')){var O=B[0].name;s.push(O+'.x='+Math.round(y.X));s.push(O+'.y='+Math.round(y.Y))}else{s.push(c.param(B))}delete l._0}var P='multipart/form-data';p._3=g.attr('enctype')==P||g.attr('encoding')==P||!!g.find('input:file')[0]}if(a.params){s.push((typeof a.params=='string')?a.params:c.param(a.params||{}))}s=a.params=s.join('&');x=a.method=a.method||x||'GET';j.addClass(h.loadingClass);if(h.loadmsgElm){N=setTimeout(function(){h.loadmsgMode=='replace'&&j.empty();j.append(h.loadmsgElm)},0)}var Q={url:a.url.split('#')[0],data:s,type:x,cache:!S,complete:function(f,d){if(!f){return}clearTimeout(N);j.removeClass(h.loadingClass||'');a.xhr=f;a.status=d||'error';var i=!d||d=='error';if(i){v(J,j,a,l)}else{a[r]=c.injectBaseHrefToHtml(f.responseText||'',a.url);if(h.imgSuppress){a[r]=a[r].replace(/(<img[^>]*? )src=/g,'$1'+A+'=')}}if(a[r]&&h.selector){a[q]=c.getResultBody(a[r],h.stripCfg).find(h.selector)}if(!i||a[r]||a[q]){if(!v(I,j,a,l)[z]()){h.loadmsgElm&&h.loadmsgElm.detach();a[q]=a[q]||c.getResultBody(a[r],h.stripCfg).contents();if(h.imgSuppress){a[q].find('img').add(a[q].filter('img')).attr('src',function(){var b=c(this),e=b.attr(A);b.removeAttr(A);return e})}j.empty().append(a[q]);l.lastRequest=a;v(K,j,a,l);j.find('form').bind('submit.vb'+j.data('VBid'),c.proxy(_1,j[0]));delete a[q];delete a[r]}}delete a.xhr;if(h.disengage){j[n]('disengage')}}};if(p._3){var R='if'+(new Date).getTime(),C=c('<iframe name="'+R+'" src=\'javascript:"";\' style="position:absolute;top:-999em;left:-999em;visibility:hidden;" />').appendTo('body'),D=g.attr('action')||'',T=g.attr('target')||'';g.attr('target',R);if(h.params){g.attr('action',D+(/\?/.test(D)?'&':'?')+h.params)}C.bind('load',function(){var b='success';Q.complete({fakeXHR:'iframe',responseText:'<html>'+C.contents().find('html').html()+'</html>'},b);g.attr({target:T,action:D});setTimeout(function(){C.remove()},0)});if(!t||!t._4){g.trigger('submit',['VBiframeHack'])}}else{c.ajax(Q)}}return p}},'data':function(){return c(this).data(n)},'disengage':function(){var b=c(this);b.removeData(n).unbind('click submit',_1).find('form').unbind('submit.vb'+b.data('VBid'),_1).end().unbind([H,J,I,K].join(' '));v(L,b);b.unbind(L)}},_1=function(b){if(!b[z]()&&!b[n+'Handled']){var e=c(b.target).closest((b.type=='submit')?'[action]':'input:submit, button:submit, input:image, [href]',this);if(e[0]){var f=c(this);if(e.is('input, button')){if(!e[0].disabled){var d=f.data(n);if(e.is(':image')){var i=e.offset();d._0={elm:e,X:b.pageX-i.left,Y:b.pageY-i.top}}else if(e.is('[name]')){d._0={elm:e}}d._0&&setTimeout(function(){delete d._0},0)}}else{var k=_2['load'].call(f[0],e,{_4:true});if(!k[u]){!k._3&&b[F]();k.isPropagationStopped()&&b[G]();b[n+'Handled']=true}}}}},fnVB=c.fn[n]=function(t,a){var g=this,m=typeof t=='string';if(m){var j=_2[t],l;if(j){g.each(function(b){var e=j.apply(this,[].concat(a));if(!b){l=e}})}if(l!==w){return l}}else{g.each(function(){var f=c(this),d=c.extend({},fnVB.defaults,t);c.each(['Beforeload','Error','Load','Loaded','Disengaged'],function(b,e){b='on'+e;d[b]&&g.bind('VB'+e.toLowerCase(),d[b]);delete d[b]});d.params=(typeof d.params=='string')?d.params:c.param(d.params||{});a&&(d.url=a);if(d.loadmsgMode!='none'){var i=d.loadmsgElm||'<div class="loading" />',k=(fnVB.i18n[f.closest('*[lang]').attr('lang')]||{}).loading||fnVB.i18n.en.loading;if(i.charAt){i=i.replace(/%\{msg\}/g,k)}i=d.loadmsgElm=c(i);if(!i.text()){i.append(k)}}else{delete d.loadmsgElm}f.data(n,{cfg:d});f.bind('click',_1);f.data('VBid',(new Date()).getTime());if(d.url){f[n]('load',d.url)}else{f.find('form').add(f.filter('form')).bind('submit.vb'+f.data('VBid'),c.proxy(_1,f[0]))}})}return this};fnVB.defaults={loadmsgMode:'none'};fnVB.i18n={en:{loading:'Loading...'},is:{loading:'Sæki gögn...'}}})(jQuery);
