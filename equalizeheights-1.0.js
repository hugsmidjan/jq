(function(F){var B=!!(F.browser.msie&&(parseInt(F.browser.version,10)<7||document.compatMode=="BackCompat")),A=(B)?"height":"min-height",E=false,D=[];function C(){for(var G=0;G<D.length;G++){D[G].equalizeHeights();}}F.fn.extend({equalizeHeights:function(G){if(G){return this.find(G).equalizeHeights();}else{var H=0;this.each(function(I){F(this).css(A,0);H=Math.max(F(this).height(),H);});this.css(A,H);if(!F.browser.msie&&!this._noPush){this._noPush=true;D.push(this);if(!E){E=true;F(window).bind("resize",C).load(C);}}else{if(!E){E=true;F(window).load(C);}}}document.body.className+="";return this;}});})(jQuery);