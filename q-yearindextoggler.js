/* $.fn.yearindextoggler 1.0  -- (c) 2016 Hugsmiðjan ehf. @preserve */
!function(e){var t=function(t,n){var r=t.find("ul"),i=r.find("h3 a"),s=r.find("li h3 .current").closest("li").find("p a");s.length||(s=r.find("p:first a"));var a=function(t,r,i){i=n.shortMonths?i.substring(0,3):i;var s=e('<div class="'+n.bemPrefix+"__wrapper "+n.bemPrefix+"__wrapper--"+r+'"><button class="'+n.bemPrefix+'__button">'+i+'</button><ul class="'+n.bemPrefix+'__list"></ul></div>');t.filter(".current")[0];var a=t.filter(".current")[0];return a&&s.find("button").text("month"===r&&n.shortMonths&&a.textContent.length>4?a.textContent.substring(0,3):a.textContent),t.detach().addClass(n.bemPrefix+"__list__item__link").wrap('<li class="'+n.bemPrefix+'__list__item"/>').parent().appendTo(s.find("ul")),s},l=a(s,"month",n.monthText),o=a(i,"year",n.yearText);n.shortMonths&&l.find("a").each(function(){var e=this.textContent;e.length>4&&(this.innerHTML=e.substring(0,3)+'<span class="sep">.</span>')}),e('<div class="'+n.bemPrefix+'"/>').append(o).append(l).appendTo(t.empty()),t.delayedHighlight({delegate:"."+n.bemPrefix+"__wrapper",className:""+n.bemPrefix+"__wrapper--focused",click:!0,clickToggles:!0})};e.fn.yearindexToggler=function(n){var r={bemPrefix:"yearindex",shortMonths:!1,monthText:"is"===e.lang()?"Mánuður":"Month",yearText:"is"===e.lang()?"Ár":"Year"},i=e.extend(r,n);return this.each(function(){t(e(this),i)})}}(jQuery);