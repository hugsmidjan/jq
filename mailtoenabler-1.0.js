// encoding: UTF-8
jQuery.fn.mailtoEnabler=function(b){var c=this,$=jQuery;if(c.length){b=$.extend({dotSymbols:['dot','punktur','period','\\.'],atSymbols:['at','hj[aá]','@'],openBracket:[' ','\\-','_','{','\\[','('],closeBracket:[' ','\\-','_','}','\\]',')'],createLinks:true},b);var d='['+b.openBracket.join('')+']+(',_5=')['+b.closeBracket.join('')+']+',_7=new RegExp(d+b.atSymbols.join('|')+_5,'i'),_6=new RegExp(d+b.dotSymbols.join('|')+_5,'gi'),_3=/^.*\/?mailto\s*:\s*/,_4=window.decodeURI||function(s){return s};return c.each(function(){var a=$('a',this)[0]||this,_1=a.tagName=='A',_0=(a.href)?_4(a.href).replace(_3,''):'',_2=!_0||_0==_4(a.href);if(_2){$('img',a).each(function(){$(this).replaceWith(this.alt)});_0=$(a).text().replace(_3,'')}_0=_0.replace(_7,'@').replace(_6,'.');b.successClass&&$(a).addClass(b.successClass);if(b.createLinks&&!_1){a=$(a).wrapInner('<a />').find('a')[0];_1=1}if(_1){a.href='mailto:'+_0}if(_2){$(a).text(_0)}})}return c};
