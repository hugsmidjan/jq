(function(d){d.ui=d.ui||{};var r=/left|center|right/,o="center",s=/top|center|bottom/,p="center",t=d.fn.position;d.fn.position=function(c){if(!c||!c.of){return t.apply(this,arguments)}c=d.extend({},c);var k=d(c.of),q=(c.collision||"flip").split(" "),j=c.offset?c.offset.split(" "):[0,0],l,m,h;if(c.of.nodeType===9){l=k.width();m=k.height();h={top:0,left:0}}else if(c.of.scrollTo&&c.of.document){l=k.width();m=k.height();h={top:k.scrollTop(),left:k.scrollLeft()}}else if(c.of.preventDefault){c.at="left top";l=m=0;h={top:c.of.pageY,left:c.of.pageX}}else{l=k.outerWidth();m=k.outerHeight();h=k.offset()}d.each(["my","at"],function(){var a=(c[this]||"").split(" ");if(a.length===1){a=r.test(a[0])?a.concat([p]):s.test(a[0])?[o].concat(a):[o,p]}a[0]=r.test(a[0])?a[0]:o;a[1]=s.test(a[1])?a[1]:p;c[this]=a});if(q.length===1){q[1]=q[0]}j[0]=parseInt(j[0],10)||0;if(j.length===1){j[1]=j[0]}j[1]=parseInt(j[1],10)||0;if(c.at[0]==="right"){h.left+=l}else if(c.at[0]===o){h.left+=l/2}if(c.at[1]==="bottom"){h.top+=m}else if(c.at[1]===p){h.top+=m/2}h.left+=j[0];h.top+=j[1];return this.each(function(){var e=d(this),f=e.outerWidth(),i=e.outerHeight(),g=d.extend({},h),n,v,w;if(c.my[0]==="right"){g.left-=f}else if(c.my[0]===o){g.left-=f/2}if(c.my[1]==="bottom"){g.top-=i}else if(c.my[1]===p){g.top-=i/2}d.each(["left","top"],function(a,b){if(d.ui.position[q[a]]){d.ui.position[q[a]][b](g,{targetWidth:l,targetHeight:m,elemWidth:f,elemHeight:i,offset:j,my:c.my,at:c.at})}});if(d.fn.bgiframe){e.bgiframe()}e.offset(d.extend(g,{using:c.using}))})};d.ui.position={fit:{left:function(a,b){var e=d(window),f=a.left+b.elemWidth-e.width()-e.scrollLeft();a.left=f>0?a.left-f:Math.max(0,a.left)},top:function(a,b){var e=d(window),f=a.top+b.elemHeight-e.height()-e.scrollTop();a.top=f>0?a.top-f:Math.max(0,a.top)}},flip:{left:function(a,b){if(b.at[0]==="center"){return}var e=d(window),f=a.left+b.elemWidth-e.width()-e.scrollLeft(),i=b.my[0]==="left"?-b.elemWidth:b.my[0]==="right"?b.elemWidth:0,g=-2*b.offset[0];a.left+=a.left<0?i+b.targetWidth+g:f>0?i-b.targetWidth+g:0},top:function(a,b){if(b.at[1]==="center"){return}var e=d(window),f=a.top+b.elemHeight-e.height()-e.scrollTop(),i=b.my[1]==="top"?-b.elemHeight:b.my[1]==="bottom"?b.elemHeight:0,g=b.at[1]==="top"?b.targetHeight:-b.targetHeight,n=-2*b.offset[1];a.top+=a.top<0?i+b.targetHeight+n:f>0?i+g+n:0}}};if(!d.offset.setOffset){d.offset.setOffset=function(a,b){if(/static/.test(jQuery.curCSS(a,"position"))){a.style.position="relative"}var e=jQuery(a),f=e.offset(),i=parseInt(jQuery.curCSS(a,"top",true),10)||0,g=parseInt(jQuery.curCSS(a,"left",true),10)||0,n={top:(b.top-f.top)+i,left:(b.left-f.left)+g};if('using'in b){b.using.call(a,n)}else{e.css(n)}};var u=d.fn.offset;d.fn.offset=function(a){var b=this[0];if(!b||!b.ownerDocument){return null}if(a){return this.each(function(){d.offset.setOffset(this,a)})}return u.call(this)}}})(jQuery);