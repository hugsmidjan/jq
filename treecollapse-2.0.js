jQuery.fn.treeCollapse=function(b){b=$.extend({rootClass:'tree-active',branch:'li.branch',toggler:'> a',openClass:'open',closedClass:'closed',leaf:'li',parentClass:'parent',selectClass:'selected',doSelect:0,startOpen:'.parent, .selected, .open',togglerInt:'> a.expand',togglerHtml:'<a class="expand" href="#"></a>',togglerPlus:'+',togglerMinus:'-',doTogglers:0},b);var c=b.branch,_5=b.openClass,_0=b.closedClass,_8=b.parentClass,_2=b.selectClass,_4=b.togglerInt,_6=b.togglerPlus,_3=b.togglerMinus,_1=b.doTogglers;this.addClass(b.rootClass).if_(b.doSelect).each(function(){var a=$(this).find(b.leaf+'.'+_2).eq(0);$(this).delegate(b.leaf,'click',function(e){if(a.length){a.removeClass(_2).parents(c).removeClass(_8)}a=$(e.delegate);a.addClass(_2).parents(c).addClass(_8)})}).end().delegate(c+' '+b.toggler,'click',function(e){var a=$(e.delegate).parents(c).eq(0),_7=a.hasClass(_0);$(this).trigger('Branch'+(_7?'Open':'Close'),{branch:a[0]});a.toggleClasses(_5,_0).if_(_1).find(_4).text(_7?_3:_6);return false}).find(c).if_(_1).prepend($(b.togglerHtml).text(_6)).end().addClass(_0).filter(b.startOpen).removeClass(_0).addClass(_5).if_(_1).find(_4).text(_3);return this};
