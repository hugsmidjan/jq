jQuery.fn.treeCollapse=function(c){c=$.extend({activeClass:'collapse-active',openClass:'open',closedClass:'closed',branches:'li.branch',branchlink:'> a',startOpen:'.parent, .selected, .open',linkTemplate:'<a class="expand" href="#">&#8900;</a>',injectLinks:0},c);var d=c.closedClass,_0=c.openClass,_2=$(this).addClass(c.activeClass).click(function(e){var a=e.target,_1=$(a).parents(c.branches).eq(0);if($.inArray(a,_1.find(c.branchlink).get())>-1){var b=_1.hasClass(c.openClass);_1.removeClass(b?_0:d).addClass(b?d:_0)}return false}).find(c.branches).addClass(d).filter(c.startOpen).removeClass(d).addClass(_0).end();if(c.injectLinks){_2.prepend(c.linkTemplate)}return this};
