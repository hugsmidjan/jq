/* $.fn.formTriggers  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
!function(a){var s={triggerSel:".trigger",reqClass:"req",subreqClass:"subreq",showFunc:"fadeIn",showSpeed:"fast",hideFunc:"hide",hideSpeed:0,closedClass:"closed"},i=function(i,t){i&&(i=i.split(/\s+/),a.each(i,function(e){var s=i[e].split("-"),r=s.pop();s=s.join("-"),"open"==r?a("#"+s)[t.showFunc](t.showSpeed).find("."+t.subreqClass).addBack().filter("."+t.subreqClass).addClass(t.reqClass):a("#"+s)[t.hideFunc](t.hideSpeed).find("."+t.subreqClass).addBack().filter("."+t.subreqClass).removeClass(t.reqClass)}))};a.fn.formTriggers=function(e){var r=a.extend(s,e);return this.each(function(){a(this).find("."+r.closedClass).hide().find("."+r.reqClass).addBack().filter("."+r.reqClass).removeClass(r.reqClass).addClass(r.subreqClass),a(this).find(r.triggerSel).each(function(){var s=a(this);s.on("change.formtriggers","input:radio",function(e){i(s.find("input:checked").attr("data-trigger"),r)}).on("change.formtriggers","input:checkbox",function(e){var s=a(this);s.is(".inverse")?i(s.attr("data-trigger")+"-"+(s.is(":checked")?"close":"open"),r):i(s.attr("data-trigger")+"-"+(s.is(":checked")?"open":"close"),r)}).on("change.formtriggers","select",function(e){i(s.find("option:selected").attr("data-trigger"),r)}).find("select, input:checked, .inverse:checkbox").trigger("change.formtriggers")})})}}(jQuery);
