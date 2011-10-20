// encoding: utf-8
// $.fn.makePageStyles 1.0  -- (c) 2011 Hugsmiðjan ehf. 
(function(a,i){a[i]=function(b){b=a.extend({},o,b);var m=a('html').attr('lang')||'en',j=i18n[m]||i18n.en,e=function(c,p,q){return a(b.itemTempl.replace(/%\{label\}/g,j[c+'L']).replace(/%\{title\}/g,j[c+'T'])).addClass(b.itemClasses[p]).appendTo(q)},k=a(b.menuTempl.replace(/%\{headline\}/g,j.headline)),d=k.find(b.menuSel);if(b.boldBtn){var f=!!a.cookie('font-bold'),n=function(c){if(c){f=!f;a.cookie('font-bold',(f?'on':null),{path:b.cookiePath,expires:b.cookieExpires});c.preventDefault()}a('body').toggleClass('font-bold',f)};n();e('b',2,d).bind('click',n)}if(b.fontsizeBtns){e('up',0,d);e('dwn',1,d)}if(b.userstyles){var g=d.clone().empty(),h=!!(b.userstyles&&a.cookie('userstyles')),l=function(c){if(c){h=!h;a.cookie('userstyles',(h?'on':null),{path:b.cookiePath,expires:b.cookieExpires});c.preventDefault()}if(h){d.before(g).detach();a('link[rel="stylesheet"]').attr('rel','disabledstylesheet');a('<link rel="stylesheet" type="text/css" class="userstylesheet" />').attr({'media':b.userstyleMedia,'href':a('meta[name="X-UserstyleURL"]').attr('content')}).appendTo('head')}else if(c){g.before(d).detach();a('link.userstylesheet').remove();a('link[rel="disabledstylesheet"]').attr('rel','stylesheet')}};e('uon',3,d).bind('click',l);e('uoff',4,g).bind('click',l);e('pref',5,g).find('a').attr('href',location.protocol+'//minar.stillingar.is/lesa/form/?redirect=yes&l='+m);l()}if(b.appendTo){k.appendTo(b.appendTo)}return k};var o=a[i].defaults={fontsizeBtns:true,userstyles:false,boldBtn:false,boldClass:'font-bold',menuTempl:'<div class="pagestyle screen"><h2>%{headline}:</h2><ul/></div>',appendTo:'body',menuSel:'ul',itemTempl:'<li><a href="#" title="%{title}">%{label}</a></li>',itemClasses:['up','dwn','bold','userstyles','off','settings'],userstyleMedia:'all',cookieExpires:365,cookiePath:'/'};i18n=a[i].i18n={is:{headline:'Útlit síðu',upL:'Stærra letur',upT:'Stækka letrið',dwnL:'Minna letur',dwnT:'Minnka letrið',bL:'Feitletrun',bT:'Feitletra allan texta',uonL:'Nota mínar stillingar',uonT:'Nota mínar lita- og leturstillingar',uoffL:'Venjulegt útlit',uoffT:'Skipta yfir í venjulegt útlit vefsins',prefL:'Breyta stillingum',prefT:'Breyta mínum lita- og leturstillingum'},en:{headline:'Page style',upL:'Larger font',upT:'Increase font size',dwnL:'Smaller font',dwnT:'Reduce font size',bL:'Bold',bT:'Toggle bold text',uonL:'Use my settings',uonT:'Switch to my text and color settings',uoffL:'Normal style',uoffT:'Switch to the normal style of this website',prefL:'Edit settings',prefT:'Change my text and color settings'},dk:{headline:'Sidens visning',upL:'Større skrifttype',upT:'Gør skrifttypen større',dwnL:'Mindre skrifttype',dwnT:'Gør skrifttypen mindre',bL:'Fed tekst',bT:'Gør teksten fed',uonL:'Benyt mine indstillinger',uonT:'Skift til mine tekst- og farveindstillinger',uoffL:'Normal visning',uoffT:'Skift til denne hjemmesides normale visning',prefL:'Redigér indstillinger',prefT:'Ændre mine tekst- og farveindstillinger'}}}(jQuery,'makePageStyles'));
