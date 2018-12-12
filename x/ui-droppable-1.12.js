// jQuery UI Droppable 1.12.1 - http://jqueryui.com - http://jqueryui.com - Copyright jQuery Foundation and other contributors; Licensed MIT
!function(e){"function"==typeof define&&define.amd?define(["jquery","./draggable","./mouse","../version","../widget"],e):e(jQuery)}(function(a){a.widget("ui.droppable",{version:"1.12.1",widgetEventPrefix:"drop",options:{accept:"*",addClasses:!0,greedy:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,t=this.options,i=t.accept;this.isover=!1,this.isout=!0,this.accept=a.isFunction(i)?i:function(e){return e.is(i)},this.proportions=function(){if(!arguments.length)return e||(e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight});e=arguments[0]},this._addToManager(t.scope),t.addClasses&&this._addClass("ui-droppable")},_addToManager:function(e){a.ui.ddmanager.droppables[e]=a.ui.ddmanager.droppables[e]||[],a.ui.ddmanager.droppables[e].push(this)},_splice:function(e){for(var t=0;t<e.length;t++)e[t]===this&&e.splice(t,1)},_destroy:function(){var e=a.ui.ddmanager.droppables[this.options.scope];this._splice(e)},_setOption:function(e,t){if("accept"===e)this.accept=a.isFunction(t)?t:function(e){return e.is(t)};else if("scope"===e){var i=a.ui.ddmanager.droppables[this.options.scope];this._splice(i),this._addToManager(t)}this._super(e,t)},_activate:function(e){var t=a.ui.ddmanager.current;this._addActiveClass(),t&&this._trigger("activate",e,this.ui(t))},_deactivate:function(e){var t=a.ui.ddmanager.current;this._removeActiveClass(),t&&this._trigger("deactivate",e,this.ui(t))},_over:function(e){var t=a.ui.ddmanager.current;t&&(t.currentItem||t.element)[0]!==this.element[0]&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this._addHoverClass(),this._trigger("over",e,this.ui(t)))},_out:function(e){var t=a.ui.ddmanager.current;t&&(t.currentItem||t.element)[0]!==this.element[0]&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this._removeHoverClass(),this._trigger("out",e,this.ui(t)))},_drop:function(t,e){var i=e||a.ui.ddmanager.current,s=!1;return!(!i||(i.currentItem||i.element)[0]===this.element[0])&&(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var e=a(this).droppable("instance");if(e.options.greedy&&!e.options.disabled&&e.options.scope===i.options.scope&&e.accept.call(e.element[0],i.currentItem||i.element)&&l(i,a.extend(e,{offset:e.element.offset()}),e.options.tolerance,t))return!(s=!0)}),!s&&(!!this.accept.call(this.element[0],i.currentItem||i.element)&&(this._removeActiveClass(),this._removeHoverClass(),this._trigger("drop",t,this.ui(i)),this.element)))},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}},_addHoverClass:function(){this._addClass("ui-droppable-hover")},_removeHoverClass:function(){this._removeClass("ui-droppable-hover")},_addActiveClass:function(){this._addClass("ui-droppable-active")},_removeActiveClass:function(){this._removeClass("ui-droppable-active")}});var l=a.ui.intersect=function(){function h(e,t,i){return t<=e&&e<t+i}return function(e,t,i,s){if(!t.offset)return!1;var o=(e.positionAbs||e.position.absolute).left+e.margins.left,n=(e.positionAbs||e.position.absolute).top+e.margins.top,r=o+e.helperProportions.width,a=n+e.helperProportions.height,l=t.offset.left,p=t.offset.top,d=l+t.proportions().width,c=p+t.proportions().height;switch(i){case"fit":return l<=o&&r<=d&&p<=n&&a<=c;case"intersect":return l<o+e.helperProportions.width/2&&r-e.helperProportions.width/2<d&&p<n+e.helperProportions.height/2&&a-e.helperProportions.height/2<c;case"pointer":return h(s.pageY,p,t.proportions().height)&&h(s.pageX,l,t.proportions().width);case"touch":return(p<=n&&n<=c||p<=a&&a<=c||n<p&&c<a)&&(l<=o&&o<=d||l<=r&&r<=d||o<l&&d<r);default:return!1}}}();return!(a.ui.ddmanager={current:null,droppables:{default:[]},prepareOffsets:function(e,t){var i,s,o=a.ui.ddmanager.droppables[e.options.scope]||[],n=t?t.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();e:for(i=0;i<o.length;i++)if(!(o[i].options.disabled||e&&!o[i].accept.call(o[i].element[0],e.currentItem||e.element))){for(s=0;s<r.length;s++)if(r[s]===o[i].element[0]){o[i].proportions().height=0;continue e}o[i].visible="none"!==o[i].element.css("display"),o[i].visible&&("mousedown"===n&&o[i]._activate.call(o[i],t),o[i].offset=o[i].element.offset(),o[i].proportions({width:o[i].element[0].offsetWidth,height:o[i].element[0].offsetHeight}))}},drop:function(e,t){var i=!1;return a.each((a.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&l(e,this,this.options.tolerance,t)&&(i=this._drop.call(this,t)||i),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,t)))}),i},dragStart:function(e,t){e.element.parentsUntil("body").on("scroll.droppable",function(){e.options.refreshPositions||a.ui.ddmanager.prepareOffsets(e,t)})},drag:function(n,r){n.options.refreshPositions&&a.ui.ddmanager.prepareOffsets(n,r),a.each(a.ui.ddmanager.droppables[n.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var e,t,i,s=l(n,this,this.options.tolerance,r),o=!s&&this.isover?"isout":s&&!this.isover?"isover":null;o&&(this.options.greedy&&(t=this.options.scope,(i=this.element.parents(":data(ui-droppable)").filter(function(){return a(this).droppable("instance").options.scope===t})).length&&((e=a(i[0]).droppable("instance")).greedyChild="isover"===o)),e&&"isover"===o&&(e.isover=!1,e.isout=!0,e._out.call(e,r)),this[o]=!0,this["isout"===o?"isover":"isout"]=!1,this["isover"===o?"_over":"_out"].call(this,r),e&&"isout"===o&&(e.isout=!1,e.isover=!0,e._over.call(e,r)))}})},dragStop:function(e,t){e.element.parentsUntil("body").off("scroll.droppable"),e.options.refreshPositions||a.ui.ddmanager.prepareOffsets(e,t)}})!==a.uiBackCompat&&a.widget("ui.droppable",a.ui.droppable,{options:{hoverClass:!1,activeClass:!1},_addActiveClass:function(){this._super(),this.options.activeClass&&this.element.addClass(this.options.activeClass)},_removeActiveClass:function(){this._super(),this.options.activeClass&&this.element.removeClass(this.options.activeClass)},_addHoverClass:function(){this._super(),this.options.hoverClass&&this.element.addClass(this.options.hoverClass)},_removeHoverClass:function(){this._super(),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass)}}),a.ui.droppable});
