jQuery.fn.roundCorners=function(B){B=jQuery.extend({tag:"span",tr:"c_tr",tl:"c_tl",br:"c_br",bl:"c_bl",activeClass:"roundbox-active"},B);var A="<"+B.tag+' class="',C='" />';return this.not(":has(>"+B.tag+"."+B.tr+")").addClass(B.activeClass).prepend(A+B.tr+C+A+B.tl+C).append(A+B.bl+C+A+B.br+C);};