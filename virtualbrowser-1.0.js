// encoding: utf-8
(function(c,q){c.fn.detach=c.fn.detach||function(){return this.each(function(){var a=this.parentNode;a&&a.nodeType==1&&a.removeChild(this)})};var l='virtualBrowser',r='VBbeforeload',s='VBload',d='replace',t=/^(https?:)?\/\//,u={'load':function(f){var e=typeof f!='string'?c(f):q,k=c(this),m=k.data(l).cfg,i=jQuery.Event(r),v=m.loadmsgMode,j={elm:e};f=j.url=e?(e.attr('href')||e.attr('action')||''):f;if(f){k.trigger(i,j);if(!i.passThrough&&((i.passThrough===q&&e&&e[0].target&&e[0].target!=window.name)||(/^([a-z]{3,12}:|\/\/)/i.test(f)&&!f.toLowerCase()[d](t,'').indexOf(location.href.toLowerCase()[d](t,'').split('/')[0])==0))){i.passThrough=true}i.passThrough&&i.preventDefault();if(!i.isDefaultPrevented()){if(v&&v!='none'){m.loadmsgMode=='replace'&&k.empty();k.append(m.loadmsgElm)}var p=m.params,w;if(e&&e.is('form')){p=e.serialize()+'&'+p;w=e.attr('method')||'GET'}c.ajax({url:j.url,data:p,type:w,complete:function(a){var g=j.url.split('#')[0],n=g.split('?')[0][d](/(.*\/).*/,'$1'),o=/\?/.test(g),b=a.responseText;o&&(b=b[d](/(['"])\?/gi,'$1¨<<`>>'));b=b[d](/(<[^>]+ (href|src|action)=["'])(["'#¨])/gi,'$1'+g+'$3');o&&(b=b[d](/(['"])¨<<`>>/gi,'$1?')[d](/¨<<`>>/gi,'&amp;'));b=b[d](/http:\/\//gi,'^<<`>>')[d](/https:\/\//gi,'`<<`>>')[d](/(<[^>]+ (href|src|action)=["'])([^\/`\^])/gi,'$1'+n+'$3')[d](/\^<<`>>/g,'http://')[d](/`<<`>>/g,'https://');j.result=b;var h=jQuery.Event(s);k.trigger(h,j);if(!h.isDefaultPrevented()){m.loadmsgElm.detach();k.empty().append(j.resultDOM||c.getResultBody(j.result)).find('form').data(l+'Elm',k).bind('submit',x)}}})}}return i}},x=function(a){var g=a.type=='submit'?a.target:c(a.target).closest('[href]')[0];if(g){var n=c(this).data(l+'Elm')||this;bfloadEv=u['load'].call(n,g);bfloadEv.isPropagationStopped()&&a.stopPropagation();!bfloadEv.passThrough&&a.preventDefault()}};fnVB=c.fn[l]=function(a,g){var n=typeof a=='string';if(n){var o=u[a];o&&this.each(function(){o.apply(this,[].concat(g))})}else{a=c.extend({loadmsgMode:'none'},a||{});g&&(a.url=g);var b=c(this),h=a.loadmsgElm||'<div class="loading" />',f=(fnVB.i18n[b.closest('[lang]').attr('lang')]||{}).loading||fnVB.i18n.en.loading;if(h.charAt){h=h.replace(/%\{msg\}/g,f)}h=a.loadmsgElm=c(h);if(!h.text()){h.append(f)}b.data(l,{cfg:a}).bind('click',x);a.onLoad&&b.bind(s,a.onLoad);a.onBeforeload&&b.bind(r,a.onBeforeload);a.params=typeof a.params=='string'?a.params:c.param(a.params||{});a.url&&b[l]('load',a.url)}return this};fnVB.i18n={en:{loading:'Loading...'},is:{loading:'Sæki gögn...'}}})(jQuery);